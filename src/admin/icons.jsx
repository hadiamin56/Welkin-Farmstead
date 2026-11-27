const P = {
  dashboard: 'M4 4h7v9H4zM13 4h7v5h-7zM13 11h7v9h-7zM4 15h7v5H4z',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3h-4l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z',
  home: 'M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z',
  bag: 'M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2',
  store: 'M4 9l1-5h14l1 5M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 6 0 2.5 2.5 0 0 0 5 0M5 11v9h14v-9',
  leaf: 'M5 19c0-8 5-13 14-14 0 9-5 14-13 14M5 19c3-5 6-8 10-10',
  fish: 'M3 12c3-5 9-6 13-2l5-3v10l-5-3c-4 4-10 3-13-2z',
  paw: 'M8 13c-2 0-3 2-3 3.500S6.500 20 9 20h6c2.500 0 4-1.500 4-3.500S17 13 15 13c-1.500 0-1.500-1-3-1s-1.500 1-4 1zM6 8.500a1.500 1.500 0 1 0 0-.1M10 6a1.500 1.500 0 1 0 0-.1M14 6a1.500 1.500 0 1 0 0-.1M18 8.500a1.500 1.500 0 1 0 0-.1',
  cap: 'M2 9l10-5 10 5-10 5zM6 11.500V16c0 1.500 3 3 6 3s6-1.500 6-3v-4.500',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  image: 'M3 5h18v14H3zM8.500 10a1.500 1.500 0 1 0 0-.1M21 16l-5-5-8 8',
  briefcase: 'M3 8h18v12H3zM9 8V5h6v3M3 13h18',
  mail: 'M3 5h18v14H3zM3 7l9 6 9-6',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  inbox: 'M4 13l2-8h12l2 8v6H4zM4 13h5l1 2h4l1-2h5',
  history: 'M4 12a8 8 0 1 0 3-6.200M4 4v4h4M12 8v5l3 2',
  users: 'M9 11a3.500 3.500 0 1 0 0-7 3.500 3.500 0 0 0 0 7zM2 20c0-3.500 3-6 7-6s7 2.500 7 6M17 5a3 3 0 0 1 0 6M19 14c2 .6 3 2.300 3 5',
  logout: 'M10 4H5v16h5M15 8l4 4-4 4M19 12H9',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  upload: 'M12 16V4M7 9l5-5 5 5M4 16v4h16v-4',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6',
  up: 'M12 19V5M6 11l6-6 6 6',
  down: 'M12 5v14M6 13l6 6 6-6',
  plus: 'M12 5v14M5 12h14',
  copy: 'M9 9h11v11H9zM5 15V4h11',
  check: 'M5 13l4 4L19 7',
  x: 'M6 6l12 12M18 6L6 18',
  menu: 'M4 7h16M4 12h16M4 17h16',
  external: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  download: 'M12 4v12M7 11l5 5 5-5M4 20h16',
  star: 'M12 3l2.700 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9z',
  key: 'M14 9a4 4 0 1 1-1.500 3L4 20v-3h3v-3h3l2-2',
  save: 'M5 4h12l3 3v13H5zM8 4v5h8V4M8 20v-6h8v6',
  refresh: 'M20 12a8 8 0 1 1-2.400-5.700M20 4v5h-5',
  alert: 'M12 3l10 18H2zM12 10v5M12 18v.1',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 8v.1',
};

export function Ico({ n, size = 20, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      <path d={P[n] || P.info} />
    </svg>
  );
}
