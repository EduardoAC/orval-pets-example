import { faker } from '@faker-js/faker';
import { defineConfig } from 'orval';


export default defineConfig({
  petstore: {
    output: {
      mode: 'tags-split',
      workspace: "src/api",
      target: 'services',
      schemas: 'models',
      client: 'react-query',
      mock: true,
      prettier: true,
      override: {
        useNativeEnums: true,
        query: {
          // https://orval.dev/guides/react-query
          useQuery: true,
          usePrefetch: true,
          options: {
            staleTime: 10000,
          },
        },
        mutator: {
          path: './mutator/custom-instance.ts',
          name: 'customInstance',
        },
        operations: {
          listPets: {
            mock: {
              properties: () => ({
                '[].id': () => faker.number.int({ min: 1, max: 99999 }),
              }),
            },
            query: {
              useQuery: true,
              useSuspenseQuery: true,
              useSuspenseInfiniteQuery: true,
              useInfinite: true,
              useInfiniteQueryParam: 'limit',
            },
          },
          showPetById: {
            mock: {
              data: () => ({
                id: faker.number.int({ min: 1, max: 99 }),
                name: faker.person.firstName(),
                tag: faker.helpers.arrayElement([
                  faker.word.sample(),
                  undefined,
                ]),
              }),
            },
          },
        },
        mock: {
          properties: {
            '/tag|name/': () => faker.person.lastName(),
          },
        },
      },
    },
    input: {
      target: './petstore.yaml',
      override: {
        transformer: './src/api/transformer/add-version.js',
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});