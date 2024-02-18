import edge from 'edge.js'
import { edgeIconify, addCollection } from 'edge-iconify'
import { icons as heroIcons } from '@iconify-json/heroicons'
import { icons as mdiIcons } from '@iconify-json/mdi'
addCollection(heroIcons)
addCollection(mdiIcons)

/**
 * Register a plugin
 */
edge.use(edgeIconify)
