import { PORT } from './config'
import { api } from './src'

api.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
)
