import "../styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  Reference,
} from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "https://api.start.gg/gql/alpha",
  cache: new InMemoryCache({
    typePolicies: {
      SetConnection: {
        fields: {
          nodes: {
            keyArgs: false,
            merge(existing, incoming) {
              let nodes: Reference[] = [];
              console.log(existing, incoming);

              if (existing) nodes = nodes.concat(existing);
              if (incoming) nodes = nodes.concat(incoming);

              return nodes;
            },
          },
        },
      },
    },
  }),
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
  },
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default MyApp;
