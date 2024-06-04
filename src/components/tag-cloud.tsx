import * as React from "react"

import { Link, useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"

const TagCloud = ({title = "タグクラウド"}) => {
  const { allMdx }: {allMdx: AllMdx} = useStaticQuery(
    graphql`
      query {
        allMdx {
          nodes {
            frontmatter {
              tags
            }
          }
        }
      }
    `
  )

  const postTags = allMdx.nodes.map(post => post.frontmatter.tags);

  const tagsBase = postTags.reduce((tagCount, post) => {
    post.map(item => {
        if (tagCount.find(i => i.name === item)) {
          tagCount.filter(i => {
            if (i.name === item) i.count++
          })
        } else {
          tagCount = [...tagCount, { name: item, count: 1 }]
        }
      })
    return tagCount
  }, [] as {name: string, count: number}[])
  // .filter(t => t.count > 1)
  .sort((a, b) => b.count - a.count)

  const largeBoundary = tagsBase[Math.ceil(tagsBase.length / 3)].count
  const smallBoundary = tagsBase[Math.floor(tagsBase.length * 2 / 3)].count
  const tagsView = tagsBase.sort(() => Math.random() - 0.5)

  return (
    <TagCloudList>
      <h5>{title}</h5>
      {tagsView.map(tag => {
        let size
        if (tag.count > largeBoundary) {
          size = "tagLarge"
        } else if (tag.count <= smallBoundary) {
          size = "tagSmall"
        } else {
          size = "tagMiddle"
        }
        return (
          <li key={tag.name} className={size}>
            <Link to={`/tag/${tag.name}`}>
              {tag.name}
            </Link>
          </li>
        )
      })}
    </TagCloudList>
  )
}

export default TagCloud

const TagCloudList = styled.ul`
  list-style: none;
  background-color: #fff;

  li {
    display: inline-block;
    padding: 3px 6px;
  }

  .tagSmall {
    font-size: var(--fontSize-0);
  }
  .tagMiddle {
    font-size: var(--fontSize-2);
  }
  .tagLarge {
    font-size: var(--fontSize-4)
  }

  a {
    line-height: 1;
    display: block;
    text-decoration: none;

    &:hover {
      color: var(--orange);
      text-decoration: underline;
    }
  }
`