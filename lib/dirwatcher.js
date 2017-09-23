import EventEmitter from 'events';
import {readdir, stat} from 'mz/fs';
import nodePath from 'path';

class DirWatcher extends EventEmitter {
    constructor() {
        super();

        this.CHANGED = 'dirwatcher:changed';
        this.dirSnapshot = null;
    }

    async watch(path, delay) {
        this.dirSnapshot = await this.makeDirSnapshot(path);

        setInterval(async () => {
            const newSnapshot = await this.makeDirSnapshot(path);

            if (this.dirContentHasChanged(this.dirSnapshot, newSnapshot)) {
                this.emit(this.CHANGED, path);
            }

            this.dirSnapshot = newSnapshot;
        }, delay);
    }

    async makeDirSnapshot(path) {
        try {
            const files = await readdir(path);
            const snapshot = {
                dirs: {},
                files: {}
            };
            const setMCTime = (fileStat) => ({
                mtime: fileStat.mtime,
                ctime: fileStat.ctime
            });

            for (let fileName of files) {
                const filePath = nodePath.resolve(path, fileName);
                const fileStat = await stat(filePath);

                if (fileStat.isFile()) {
                    snapshot.files[fileName] = setMCTime(fileStat);
                }

                if (fileStat.isDirectory()) {
                    snapshot.dirs[fileName] = setMCTime(fileStat);
                }
            }

            return snapshot;
        } catch(err) {
            throw err;
        }
    }

    dirContentHasChanged(oldSnapshot, newSnapshot) {
        const {files: oldFiles, dirs: oldDirs} = oldSnapshot;
        const {files: newFiles, dirs: newDirs} = newSnapshot;

        return !this.dirItemsAreTheSame(oldFiles, newFiles) || !this.dirItemsAreTheSame(oldDirs, newDirs);
    }

    dirItemsAreTheSame(oldItem, newItem) {
        const oldItemNames = Object.keys(oldItem);
        const newItemNames = Object.keys(newItem);
        const namesAreTheSame = (oldNames, newNames) => {
            oldNames.sort();
            newNames.sort();

            for (let [i, name] of oldNames.entries()) {
                if (oldNames[i] !== newNames[i]) {
                    return false;
                }
            }

            return true;
        };

        if (oldItemNames.length !== newItemNames.length || !namesAreTheSame(oldItemNames, newItemNames)) {
            return false;
        }

        for (let key in newItem) {
            if (newItem.hasOwnProperty(key)) {
                if (
                    newItem[key].ctime.toString() !== oldItem[key].ctime.toString() ||
                    newItem[key].mtime.toString() !== oldItem[key].mtime.toString()
                ) {
                    return false;
                }
            }
        }

        return true;
    }
}

export default DirWatcher;
