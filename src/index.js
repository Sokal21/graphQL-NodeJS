const { GraphQLServer } = require('graphql-yoga')
const { List, fromJS } = require('immutable')

let links = List()

const resolvers = {
  Query: {
    feed: () => links,
    link: (root, args) => {
      const foundedLink = links.find((link) => link.get('id') === args.id)
      return foundedLink
    },
  },
  Link: {
    id: (link) => link.get('id'),
    url: (link) => link.get('url'),
    description: (link) => link.get('description'),
  },
  Mutation: {
    post: (root, args) => {
      const link = {
        id: `link-${links.size + 1}`,
        description: args.description,
        url: args.url
      }
      links = links.push(fromJS(link))
      return fromJS(link)
    },
    updateLink: (root, args) => {
      links = links.updateIn(
        (link) => link.get('id') === args.id,
        (link) => link.merge({
            url: args.url,
            description: args.description
          }
        )
      )
      const foundedLink = links.find((link) => link.get('id') === args.id)
      return foundedLink
    },
    deleteLink: (root, args) => {
      const linkIndex = links.findIndex((link) => link.get('id') === args.id)
      let deletedLink;
      if(linkIndex >= 0) {
        deletedLink = links.find((link) => link.get('id') === args.id)
        links = links.delete(linkIndex)
      }
      return deletedLink
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})

server.start(() => console.log('Server is running on http://localhost:4000'))
