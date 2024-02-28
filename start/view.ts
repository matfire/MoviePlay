import edge from 'edge.js'
import { edgeViewTransitions } from '@matfire/edge-view-transitions'
import { edgeIconify, addCollection } from 'edge-iconify'
import { icons as heroIcons } from '@iconify-json/heroicons'
import { icons as mdiIcons } from '@iconify-json/mdi'
import { icons as openMojiIcons } from '@iconify-json/openmoji'
addCollection(heroIcons)
addCollection(mdiIcons)
addCollection(openMojiIcons)

/**
 * Register a plugin
 */
edge.use(edgeIconify)
edge.use(edgeViewTransitions)

edge.global('duration', (d: string) => {
  const hours = Math.floor(Number(d) / 60)
  const minutes = Number(d) % 60

  return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`
})
