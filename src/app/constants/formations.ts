import { FormationMap } from './formation-types';

export const FORMATION_POSITIONS: FormationMap = {
    '4-4-2': [
        { type: 'gk', order: 1 },
        { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
        { type: 'mid', order: 1 }, { type: 'mid', order: 2 }, { type: 'mid', order: 3 }, { type: 'mid', order: 4 },
        { type: 'fw', order: 1 }, { type: 'fw', order: 2 }
    ],
    '4-3-3': [
        { type: 'gk', order: 1 },
        { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
        { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-c', order: 3 },
        { type: 'fw-w', order: 1 }, { type: 'fw-s', order: 1 }, { type: 'fw-w', order: 2 }
    ],
    '4-3-3-(2)': [
        { type: 'gk', order: 1 },
        { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
        { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-c', order: 3 },
        { type: 'fw-w', order: 1 }, { type: 'fw-s', order: 1 }, { type: 'fw-w', order: 2 }
    ],
    '3-5-2': [
        { type: 'gk', order: 1 },
        { type: 'def-cb', order: 1 }, { type: 'def-cb', order: 2 }, { type: 'def-cb', order: 3 },
        { type: 'mid-wb', order: 1 }, { type: 'mid-wb', order: 2 },
        { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-c', order: 3 },
        { type: 'fw', order: 1 }, { type: 'fw', order: 2 }
    ],
    '4-2-3-1': [
        { type: 'gk', order: 1 },
        { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
        { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 },
        { type: 'mid-ac', order: 1 }, { type: 'mid-ac', order: 2 }, { type: 'mid-ac', order: 3 },
        { type: 'fw', order: 1 }
    ],
    '4-1-4-1': [
        { type: 'gk', order: 1 },
        { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
        { type: 'mid-dm', order: 1 },
        { type: 'mid-w', order: 1 }, { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-w', order: 2 },
        { type: 'fw', order: 1 }
    ],
    '3-4-3': [
        { type: 'gk', order: 1 },
        { type: 'def-cb', order: 1 }, { type: 'def-cb', order: 2 }, { type: 'def-cb', order: 3 },
        { type: 'mid-wb', order: 1 }, { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-wb', order: 2 },
        { type: 'fw-w', order: 1 }, { type: 'fw-s', order: 1 }, { type: 'fw-w', order: 2 }
    ],
    '5-3-2': [
        { type: 'gk', order: 1 },
        { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 }, { type: 'def', order: 5 },
        { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-c', order: 3 },
        { type: 'fw', order: 1 }, { type: 'fw', order: 2 }
    ],
    '4-5-1': [
        { type: 'gk', order: 1 },
        { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
        { type: 'mid-dm', order: 1 },
        { type: 'mid-w', order: 1 }, { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-w', order: 2 },
        { type: 'fw', order: 1 }
    ],
    '4-3-2-1': [
        { type: 'gk', order: 1 },
        { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
        { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-c', order: 3 },
        { type: 'mid-am', order: 1 }, { type: 'mid-am', order: 2 },
        { type: 'fw', order: 1 }
    ],
    '3-6-1': [
        { type: 'gk', order: 1 },
        { type: 'def-cb', order: 1 }, { type: 'def-cb', order: 2 }, { type: 'def-cb', order: 3 },
        { type: 'mid-dm', order: 1 }, { type: 'mid-dm', order: 2 },
        { type: 'mid-w', order: 1 }, { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-w', order: 2 },
        { type: 'fw', order: 1 }
    ],
    '4-2-2-2': [
        { type: 'gk', order: 1 },
        { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
        { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 },
        { type: 'mid-ac', order: 1 }, { type: 'mid-ac', order: 2 },
        { type: 'fw', order: 1 }, { type: 'fw', order: 2 }
    ],
    '3-2-4-1': [
        { type: 'gk', order: 1 },
        { type: 'def-cb', order: 1 }, { type: 'def-cb', order: 2 }, { type: 'def-cb', order: 3 },
        { type: 'mid-dm', order: 1 }, { type: 'mid-dm', order: 2 },
        { type: 'mid-w', order: 1 }, { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-w', order: 2 },
        { type: 'fw', order: 1 }
    ],
    '4-4-1-1': [
        { type: 'gk', order: 1 },
        { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
        { type: 'mid-w', order: 1 }, { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-w', order: 2 },
        { type: 'mid-am', order: 1 },
        { type: 'fw', order: 1 }
    ],
    '4-3-1-2': [
        { type: 'gk', order: 1 },
        { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
        { type: 'mid-dm', order: 1 },
        { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 },
        { type: 'mid-am', order: 1 },
        { type: 'fw', order: 1 }, { type: 'fw', order: 2 }
    ],
    '3-4-2-1': [
        { type: 'gk', order: 1 },
        { type: 'def-cb', order: 1 }, { type: 'def-cb', order: 2 }, { type: 'def-cb', order: 3 },
        { type: 'mid-wb', order: 1 }, { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-wb', order: 2 },
        { type: 'mid-am', order: 1 }, { type: 'mid-am', order: 2 },
        { type: 'fw', order: 1 }
    ]
};
