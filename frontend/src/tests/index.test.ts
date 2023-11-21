import { render, fireEvent } from "@testing-library/react";
import react, { ReactElement } from "react";
import Home from "@/app/page";
import "@testing-library/jest-dom";

describe("Home page", () => {
    // there should be a button with text "Add a Book"
    it('should have a button with text "Add a Book"', () => {
        const { getByText } = render(<Home />);
        expect(getByText("Add a Book")).toBeInTheDocument();
    });
});

// test("", () => {
//     const creen = render(<div></div>);

// });
