# Extract envs from process.env
```ts
import { Env } from '@hastom/env-extractor'

// num resolves as number
const num = Env.number('PORT').default(3030).get()
// str resolves as string
const str = Env.string('API_KEY').required().get()
// bool resolves as boolean | undefined 
// because nor default nor required were set
const bool = Env.boolean('IS_DEV').get()
// json resolves as { isNice: boolean } | undefined
const json = Env.json<{ isNice: boolean }>('NICE_ENV').get()
```

__This package does not set envs to process.env use dotenv package with it__
