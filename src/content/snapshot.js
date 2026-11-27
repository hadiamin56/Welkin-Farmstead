// The content the site was built with. `live.json` (optional, written at build time from the published
// admin content) overrides the built-in defaults, so freshly built pages already contain the latest text.
import { DEFAULTS } from './defaults.js';
import { withDefaults } from './merge.js';

const live = import.meta.glob('./live.json', { eager: true, import: 'default' })['./live.json'];

export const SNAPSHOT = withDefaults(live && live.content ? live.content : DEFAULTS);
export const SNAPSHOT_VERSION = live && live.version ? live.version : 0;
