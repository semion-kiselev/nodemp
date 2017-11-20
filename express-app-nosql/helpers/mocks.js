exports.loadCollectionIfNotExists = async (Model, mocks) => {
    try {
        const result = await Model.find({});

        if (!result.length) {
            await Model.create(mocks);
        }
    } catch(err) {
        throw err;
    }
};
