import { ImageResponse } from '@vercel/og'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const grade = (query.grade as string) || 'bronze'
  const name = (query.name as string) || '코끼리'
  const age = (query.age as string) || '55'
  const percentile = (query.percentile as string) || '95'
  const desc = (query.desc as string) || '대지의 지혜자, 코끼리입니다.'
  const image = (query.image as string) || '/animals/elephant.jpg'

  const gradeColors: Record<string, string> = {
    master: '#FF6FD8',
    diamond: '#B9F2FF',
    platinum: '#E5E4E2',
    gold: '#F0C040',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
  }

  const color = gradeColors[grade] || '#F0C040'
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
          // 배경 동물 이미지
          {
            type: 'img',
            props: {
              src: imageUrl,
              style: {
                position: 'absolute',
                inset: '0',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }
            }
          },
          // 다크 오버레이
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                inset: '0',
                background: 'linear-gradient(to right, rgba(8,8,8,0.92) 50%, rgba(8,8,8,0.5) 100%)',
              }
            }
          },
          // 컨텐츠 (왼쪽 정렬)
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                inset: '0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '60px 80px',
                fontFamily: 'sans-serif',
              },
              children: [
                // 브랜드
                {
                  type: 'div',
                  props: {
                    style: { fontSize: '20px', color: '#A07820', letterSpacing: '3px', marginBottom: '32px' },
                    children: '🦻 황금귀 챌린지'
                  }
                },
                // 등급 뱃지
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      marginBottom: '20px',
                    },
                    children: {
                      type: 'div',
                      props: {
                        style: {
                          background: `${color}22`,
                          border: `2px solid ${color}55`,
                          borderRadius: '999px',
                          padding: '8px 28px',
                          fontSize: '22px',
                          fontWeight: '700',
                          color: color,
                          letterSpacing: '4px',
                        },
                        children: grade === 'master' ? '황금귀' : grade.toUpperCase()
                      }
                    }
                  }
                },
                // 동물 이름
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '72px',
                      fontWeight: '800',
                      color: '#F0EDE6',
                      marginBottom: '12px',
                      letterSpacing: '-2px',
                      lineHeight: '1.1',
                    },
                    children: `${name} 귀`
                  }
                },
                // desc
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '26px',
                      color: '#888880',
                      marginBottom: '48px',
                    },
                    children: desc
                  }
                },
                // 수치
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', gap: '24px' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            background: 'rgba(17,17,17,0.8)',
                            border: '1px solid rgba(240,192,64,0.15)',
                            borderRadius: '16px',
                            padding: '16px 32px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          },
                          children: [
                            { type: 'div', props: { style: { fontSize: '16px', color: '#888880', marginBottom: '6px' }, children: '청력 나이' } },
                            { type: 'div', props: { style: { fontSize: '44px', fontWeight: '800', color: '#F0C040' }, children: `${age}세` } },
                          ]
                        }
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            background: 'rgba(17,17,17,0.8)',
                            border: '1px solid rgba(240,192,64,0.15)',
                            borderRadius: '16px',
                            padding: '16px 32px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          },
                          children: [
                            { type: 'div', props: { style: { fontSize: '16px', color: '#888880', marginBottom: '6px' }, children: '상위' } },
                            { type: 'div', props: { style: { fontSize: '44px', fontWeight: '800', color: '#F0C040' }, children: `${percentile}%` } },
                          ]
                        }
                      },
                    ]
                  }
                },
              ]
            }
          },
        ]
      }
    },
    { width: 1200, height: 630 }
  )
})
