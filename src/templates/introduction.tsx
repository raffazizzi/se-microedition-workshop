import React from "react"

import SEO from "../components/seo"
import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import theme from "../theme"
import Layout from "../components/layout"
import { graphql, useStaticQuery } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"


interface Props {
  pageContext: {
    title?: string
    html: string
  },
  location: string
}

interface Author {
  first: string
  middle?: string
  last: string,
  affiliations: string[]
  orcid?: string
}


export default function Introduction({pageContext}: Props) {
  const { site, orcid } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            htmlTitle
            authors {
              first
              middle
              last
              affiliations
              orcid
            }
          }
        }
        orcid: allFile(filter: {relativePath: {eq: "orcid.png"}}) {
          nodes {
            childImageSharp {
              gatsbyImageData(width: 16)
            }
          }
        }
      }
    `
  )


  const authors = site.siteMetadata.authors.map((a: Author) => (
    <React.Fragment key={a.last}>
      {a.first} {a.middle || ''} {a.last}, {a.affiliations.join(', ')}
      {a.orcid && 
        <a href={`https://orcid.org/${a.orcid}`} >
          <GatsbyImage image={orcid.nodes[0].childImageSharp.gatsbyImageData} alt="ORCID logo"/>
        </a>
      }
      <br/>
    </React.Fragment>
  ))

  return (
    <Layout location="intro">
      <SEO title="Introduction" />
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container component="main" maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom={false} dangerouslySetInnerHTML={
            {__html: site.siteMetadata.htmlTitle}
          } />
          {pageContext.title ?
            <Typography variant="h4" component="h3" gutterBottom={false} dangerouslySetInnerHTML={
              {__html: pageContext.title}
            } />
          : ''}
          <Typography variant="h5" component="h4" gutterBottom={false} >
              Edited by {site.siteMetadata.authors.length > 1 ? <br/> : ''}
              {authors}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            component="div"
            dangerouslySetInnerHTML={{ __html: pageContext.html }}
          />
          </Container>
        </ThemeProvider>
      </StyledEngineProvider>
    </Layout>
  );
}
