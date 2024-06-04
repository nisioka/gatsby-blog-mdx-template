/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import config from "../../gatsby-config"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {  faGithub, faXTwitter} from "@fortawesome/free-brands-svg-icons"
import { Link } from "gatsby"

const Bio = () => {
  const { siteMetadata }  = config as { siteMetadata: SiteMetadata }

  // Set these values by editing "siteMetadata" in gatsby-config
  const author = siteMetadata.author
  const social = siteMetadata.social

  return (
    <div className="bio">
      <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["auto", "webp", "avif"]}
        src="../../static/favicon.webp"
        width={50}
        height={50}
        alt="Profile picture"
      />
      <p>
        <strong>{author.name}</strong>: <small>{author.summary}</small><br />
        <Link to={`https://github.com/${social.github}`} target="_blank" rel="noopener">
          <FontAwesomeIcon icon={faGithub} fontSize={24} style={{color: "black"}} />
        </Link>
        <Link to={`https://twitter.com/${social.twitter}`} target="_blank" rel="noopener">
          <FontAwesomeIcon icon={faXTwitter} fontSize={24}  style={{color: "black"}}/>
        </Link>
      </p>
    </div>
  )
}

export default Bio
