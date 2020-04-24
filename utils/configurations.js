const config = require('config')

module.exports = {
    db: {
        getUri: () => {
            if(config.get('ENVIRONMENT') == 'PRODUCTION'){
                return config.get('db.PRODUCTION')   
            }
            return config.get('db.DEVELOPMENT')
        },
    
        getOptions: () => {
            return config.get('db.OPTIONS')
        },
    
        getLogOptions: () => {
            return config.get('db.LOG_OPTIONS')
        }
    },

    app: {
        getEnvironment: () => {
            return config.get('ENVIRONMENT')
        },

        getPort: () => {
            return config.get('PORT')
        }
    }

}