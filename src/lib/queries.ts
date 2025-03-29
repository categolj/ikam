import { gql } from 'graphql-request';

// Query to get all entries with pagination support
export const GET_ENTRIES = gql`
  query GetEntries($first: Int, $after: String, $tag: String, $categories: [String]) {
    getEntries(first: $first, after: $after, tag: $tag, categories: $categories) {
      edges {
        node {
          entryId
          frontMatter {
            title
            categories {
              name
            }
            tags {
              name
            }
          }
          created {
            name
            date
          }
          updated {
            name
            date
          }
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

// Query to get a single entry by ID
export const GET_ENTRY = gql`
  query GetEntry($entryId: ID!) {
    getEntry(entryId: $entryId) {
      entryId
      content
      frontMatter {
        title
        categories {
          name
        }
        tags {
          name
        }
      }
      created {
        name
        date
      }
      updated {
        name
        date
      }
    }
  }
`;
