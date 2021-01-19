const Mutation = {
    addMarker(parent, {marker}, {models, pubsub}, info){
        const _marker = new models.Marker({
            username: marker.username,
            properties:{
                title: marker.title,
                description: marker.description
            },
            geometry: {
                coordinates: marker.coordinates
            }
        })
        _marker.save()
        pubsub.publish(_marker.username, {subscribeUser: {
            mutation: 'NEW', data: _marker
        }})
    },
    clearAll(parent, args, {models, pubsub}, info){
        // shouldn't be called, only for debugging
        models.Marker.deleteMany({}, () => {})
    },
    async deleteMarker(parent, {_id}, {models, pubsub}, info){
        const marker = await models.Marker.findByIdAndDelete(_id, () => {})
        pubsub.publish(marker.username, {subscribeUser: {
            mutation: 'DELETE', data: marker
        }})
    },
    async updateMarker(parent, {_id, newTitle, newDescription}, {models, pubsub}, info){ 
        const option = Object.fromEntries(
            Object.entries({"properties.title": newTitle,
             "properties.description": newDescription})
            .filter(([_, v]) => v != null));
        const marker = await models.Marker.findByIdAndUpdate({_id},
            option, () => {})
        pubsub.publish(marker.username, {subscribeUser: {
            mutation: 'UPDATE', data: marker
        }})
    }
}

module.exports = Mutation