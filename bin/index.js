#!/usr/bin/env node

import { program } from "commander";

program
  .version("1.0.0")
  .description("My CLI")
  .option("-n, --name <name>", "Your name")
  .action((options) => {
    console.log(`Hello, ${options.name || "World"}!`);
  });

program.parse(process.argv);
