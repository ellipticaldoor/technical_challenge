import { render, fireEvent, waitFor } from "@testing-library/react";
import { SearchReposTable } from "./SearchReposTable";
import { searchReposQueryMock } from "./mocks";
import { client } from "./client";
import { SearchReposQuery } from "./queries";

const clientMock = jest.spyOn(client, "request");

beforeEach(() => {
  jest.resetAllMocks();
  clientMock.mockResolvedValue(searchReposQueryMock);
});

describe("SearchReposQuery", () => {
  test("it renders a search query by default", async () => {
    const { findAllByRole } = render(<SearchReposTable />);

    await waitFor(() =>
      expect(clientMock).toHaveBeenCalledWith(SearchReposQuery, {
        variables: { after: undefined, first: 10, searchParam: "react" },
      }),
    );

    const Rows = await findAllByRole("link");

    expect(Rows.length).toEqual(searchReposQueryMock.data.search.edges.length);
  });

  test("it requests the next page when button is clicked", async () => {
    const { findByText } = render(<SearchReposTable />);

    await waitFor(() => expect(clientMock).toHaveBeenCalledTimes(1));

    const FetchNextPageButton = await findByText("Get next page");

    fireEvent.click(FetchNextPageButton);

    await waitFor(() =>
      expect(clientMock).toHaveBeenCalledWith(SearchReposQuery, {
        variables: { after: "Y3Vyc29yOjEw", first: 10, searchParam: "react" },
      }),
    );
  });

  test("it requests a new set of repos when the search input changes", async () => {
    const { findByPlaceholderText } = render(<SearchReposTable />);

    const SearchInput = await findByPlaceholderText("Search");

    fireEvent.change(SearchInput, {
      target: { value: "css libraries" },
    });

    await waitFor(() =>
      expect(clientMock).toHaveBeenCalledWith(SearchReposQuery, {
        variables: {
          after: undefined,
          first: 10,
          searchParam: "css libraries",
        },
      }),
    );
  });
});
