import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import { convertCategory, mergePosts } from "../utilFunction"
import { GatsbyImage } from "gatsby-plugin-image"
import { ContentsListHeader, ContentsOrderedListWrapper } from "../style"

type RelatedListProps = {
  slug: string
  category: string
  tags: string[]
  title: string
}
const RelatedList = ({ slug, category, tags, title = "関連記事" }: RelatedListProps) => {
  const { allMdx, allFile }: {allMdx: AllMdx, allFile: AllFile} = useStaticQuery(
    graphql`
      query {
        allMdx(
          sort: { frontmatter: { date: DESC } }
        ) {
          nodes {
            excerpt
            fields {
              slug
            }
            frontmatter {
              title
              date(formatString: "YYYY/MM/DD")
              description
              featuredImagePath
              category
              tags
            }
          }
        }
        allFile(
          filter: {
            sourceInstanceName: { eq: "images" }
          }
        ) {
          edges {
            node {
              relativePath
              childImageSharp {
                gatsbyImageData(
                  width: 100,
                  height: 100
                  formats: [AUTO, WEBP, AVIF]
                  placeholder: BLURRED
                )
              }
            }
          }
        }
      }
    `
  )

  // 関連度計算。
  const posts = mergePosts(allMdx, allFile).map(post => {
    let point = 0
    if (post.slug !== slug) {
      // カテゴリの一致出力
      if (post.category === category) point++;
      // タグの一致出力。記事のタグの中に一致するものがあればtrueを返す。
      for (const tag of tags) {
        if (post.tags.includes(tag)) point += 2;
      }
    }
    return { post: post, relevance: point }
  })
  .filter(r => r.relevance >= 2)
  .sort((a, b) => a.relevance = b.relevance ? (a.post.date < b.post.date ? 1 : -1) : b.relevance - a.relevance)
  .slice(0, 6).map(r => r.post)

  if (!posts) return <></>

  return (
    <>
      <ContentsListHeader>
        <h2>{title}</h2>
      </ContentsListHeader>
      <ContentsOrderedListWrapper>
        {posts.map((post, index) => {
          return (
            <li key={post.slug}>
              <article>
                <Link to={`/${convertCategory(post.category)}/${post.slug}`}>
                  <h2>
                    <span>{post.title}</span>
                  </h2>
                  <section>
                    <div><small>
                      <time>{post.date}</time>
                    </small></div>
                    <div className="thumbnail">
                      {typeof post.gatsbyImage === "undefined" ||
                        <GatsbyImage alt={post.altText} image={post.gatsbyImage} className="thumbnail" />
                      }
                    </div>
                    <p
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />
                  </section>
                </Link>
              </article>
            </li>
          )
        })}
      </ContentsOrderedListWrapper>
    </>
  )
}

export default RelatedList
