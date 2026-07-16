const app = require('./app') // Express app
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`server running on prot ${config.PORT}`)
})
