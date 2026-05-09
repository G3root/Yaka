#!/usr/bin/env bun

import { createRoot } from "@opentui/react"
import { App } from "./App.js"
import { createCliRenderer } from "@opentui/core"

const Bootstrap = () => {
	return <App />
}

const renderer = await createCliRenderer()
createRoot(renderer).render(<Bootstrap />)
