import { ImageResponse } from '@vercel/og'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const image = (query.image as string) || '/animals/elephant.jpg'
  const imageUrl = `https://goldear.kr${image}`

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          {
            type: 'img',
            props: {
              src: imageUrl,
              style: {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }
            }
          },
        ]
      }
    },
    { width: 1200, height: 630 }
  )
})
