// This file manually imports all posts to ensure they're available in tests
import post1 from '../../posts/2022-11-30-yet-another-blog-migration.md?raw'
import post2 from '../../posts/2022-12-01-startup-like-big-tech.md?raw'
import post3 from '../../posts/yo-with-front-matter.md?raw'
import post4 from '../../posts/yo.md?raw'

export const postsModules = {
  '../../posts/2022-11-30-yet-another-blog-migration.md': () =>
    Promise.resolve({ default: post1 }),
  '../../posts/2022-12-01-startup-like-big-tech.md': () =>
    Promise.resolve({ default: post2 }),
  '../../posts/yo-with-front-matter.md': () =>
    Promise.resolve({ default: post3 }),
  '../../posts/yo.md': () => Promise.resolve({ default: post4 }),
}
