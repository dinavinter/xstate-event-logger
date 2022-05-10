/* @jsx h */
import { h } from "@stencil/core";
import "../src/index.tsx";

export default {
  parameters: {
    layout: "centered",
  },
};

export const story1 = () => <my-counter></my-counter>;
