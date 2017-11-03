const makeEncoreUrl = name => env =>
  `https://${name}${env ? `-${env}` : ''}.nfib.org/api/`;
const makeDotComUrl = path => env =>
  `https://${env ? `${env}` : 'www'}.nfib.com/${path}`;
const makeEngageUrl = name => env =>
  `https://engage${env ? `-${env}` : ''}.nfib.org/${name}`;

const generateUrls = lookup => fn => {
  return Object.keys(lookup).reduce((acc, key) => {
    const env = lookup[key];
    const url = fn(env);
    const urlObject = Object.assign({}, acc, {
      [key]: url,
    });
    return urlObject;
  }, {});
};

const encoreUrlLookup = {
  development: 'dv',
  sandbox: 'sb',
  integration: 'dv',
  qa: 'qa',
  ua: 'ua',
  staging: 'st',
  production: '',
};
const generateEncoreUrls = generateUrls(encoreUrlLookup);
const dotComUrlLookup = {
  development: 'dv',
  sandbox: 'dv',
  integration: 'dv',
  qa: 'qa',
  ua: 'ua',
  staging: 'st',
  production: '',
};
const generateDotComUrls = generateUrls(dotComUrlLookup);
const engageUrlLookup = {
  development: 'dv',
  sandbox: 'sb',
  integration: 'dv',
  qa: 'qa',
  ua: 'ua',
  staging: 'st',
  production: '',
};
const generateEngageUrls = generateUrls(engageUrlLookup);

module.exports = {
  helmet: {
    contentSecurityPolicy: {
      directives: {
        frameSrc: ['player.vimeo.com'],
        connectSrc: ['example.com/'],
        imgSrc: ['https://d3dkdvqff0zqx.cloudfront.net'],
      },
    },
  },
  cors: {
    exposedHeaders: ['authorizationtoken'],
  },
  proxies: {
    Payments: {
      url: generateEncoreUrls(makeEncoreUrl('payments')),
      route: '/api/pmts',
    },
    Engagements: {
      url: generateEncoreUrls(makeEncoreUrl('engagements')),
      route: '/api/emts',
    },
    Legislators: {
      url: generateEncoreUrls(makeEncoreUrl('legislators')),
      route: '/api/legs',
    },
    Customers: {
      url: generateEncoreUrls(makeEncoreUrl('customers')),
      route: '/api/cuss',
    },
    // TODO: DEPRECATE (REQUIRED REWRITE OF EVENTS)
    Association: {
      url: {
        development: 'https://customers-dv.nfib.org/api/association/',
        sandbox: 'https://customers-sb.nfib.org/api/association/',
        integration: 'https://customers-dv.nfib.org/api/association/',
        qa: 'https://customers-qa.nfib.org/api/association/',
        ua: 'https://customers-ua.nfib.org/api/association/',
        staging: 'https://customers-st.nfib.org/api/association/',
        production: 'https://customers.nfib.org/api/association/',
      },
      route: '/api/association',
    },
    // TODO: DEPRECATE (REQUIRED REWRITE OF EVENTS)
    Individuals: {
      url: {
        development: 'https://customers-dv.nfib.org/api/individual/',
        sandbox: 'https://customers-sb.nfib.org/api/individual/',
        integration: 'https://customers-dv.nfib.org/api/individual/',
        qa: 'https://customers-qa.nfib.org/api/individual/',
        ua: 'https://customers-ua.nfib.org/api/individual/',
        staging: 'https://customers-st.nfib.org/api/individual/',
        production: 'https://customers.nfib.org/api/individual/',
      },
      route: '/api/customer',
    },
    // TODO: DEPRECATE (REQUIRED REWRITE OF EVENTS)
    Organizations: {
      url: {
        development: 'https://customers-dv.nfib.org/api/organization/',
        sandbox: 'https://customers-sb.nfib.org/api/organization/',
        integration: 'https://customers-dv.nfib.org/api/organization/',
        qa: 'https://customers-qa.nfib.org/api/organization/',
        ua: 'https://customers-ua.nfib.org/api/organization/',
        staging: 'https://customers-st.nfib.org/api/organization/',
        production: 'https://customers.nfib.org/api/organization/',
      },
      route: '/api/organization',
    },
    // TODO: DEPRECATE (REQUIRED REWRITE OF EVENTS)
    Events: {
      url: {
        development: 'https://engagements-dv.nfib.org/api/events/',
        sandbox: 'https://engagements-sb.nfib.org/api/events/',
        integration: 'https://engagements-dv.nfib.org/api/events/',
        qa: 'https://engagements-qa.nfib.org/api/events/',
        ua: 'https://engagements-ua.nfib.org/api/events/',
        staging: 'https://engagements-st.nfib.org/api/events/',
        production: 'https://engagements.nfib.org/api/events/',
      },
      route: '/api/events',
    },
    // TODO: DEPRECATE (REQUIRED REWRITE OF EVENTS)
    EventRegistration: {
      url: {
        development:
          'https://engagements-dv.nfib.org/api/eventregistrationdetails/',
        sandbox:
          'https://engagements-sb.nfib.org/api/eventregistrationdetails/',
        integration:
          'https://engagements-dv.nfib.org/api/eventregistrationdetails/',
        qa: 'https://engagements-qa.nfib.org/api/eventregistrationdetails/',
        ua: 'https://engagements-ua.nfib.org/api/eventregistrationdetails/',
        staging:
          'https://engagements-st.nfib.org/api/eventregistrationdetails/',
        production:
          'https://engagements.nfib.org/api/eventregistrationdetails/',
      },
      route: '/api/register',
    },
    NView: {
      url: {
        development: 'https://nview-qa.nfib.org/NViewREST/api/',
        sandbox: 'https://nview-qa.nfib.org/NViewREST/api/',
        integration: 'https://nview-qa.nfib.org/NViewREST/api/',
        qa: 'https://nview-qa.nfib.org/NViewREST/api/',
        ua: 'https://nview-ua.nfib.org/NViewREST/api/',
        staging: 'https://nview.nfib.org/NViewREST/api/',
        production: 'https://nview.nfib.org/NViewREST/api/',
      },
      route: '/api/nview',
      properties: {
        headers: {
          NFIBAppID: 'MzlkNjk0MTQtMWY0ZS00YTQ5LWJhNGQtNTlkYzJmMDhlZTg2',
          'X-NFIB-EnableCors': 'true',
        },
      },
    },
    Geocoding: {
      url: 'https://nominatim.openstreetmap.org/reverse/',
      route: '/api/geocoder',
    },
  },
  redirect: {
    'email-preferences':
      'http://nfib.highroadsolution.com/nfib_preference_center/default.aspx',
    join: generateDotComUrls(makeDotComUrl('signup')),
    renew: generateDotComUrls(makeDotComUrl('renew')),
    'join-existing': generateDotComUrls(makeDotComUrl('signup')),
    ballots: generateDotComUrls(makeDotComUrl('my-surveys')),
    logout: generateDotComUrls(makeDotComUrl('logout/')),
    advocacy: generateDotComUrls(makeDotComUrl('advocacy/')),
    resources: generateDotComUrls(makeDotComUrl('business-resources/')),
    news: generateDotComUrls(makeDotComUrl('news/')),
    foundations: generateDotComUrls(makeDotComUrl('foundations/')),
    video: generateDotComUrls(makeDotComUrl('video/')),
    'member-benefits': generateDotComUrls(makeDotComUrl('member-vantage/')),
    mynfib: generateEngageUrls(makeEngageUrl('account')),
    events: generateEngageUrls(makeEngageUrl('events')),
    'why-nfib': generateDotComUrls(makeDotComUrl('why-nfib')),
  },
  appId: 'd1e4d5f5-704f-4091-8fa4-5d0b848b493d',
  session: {
    secret: ['nfibN0d3!'],
    cookie: {
      httpOnly: true,
      sameSite: true,
      maxAge: 1000 * 60 * 30,
    },
    resave: false,
    saveUninitialized: false,
  },
  tracking: {
    google: {
      development: 'UA-54753018-4',
      sandbox: 'UA-54753018-4',
      integration: 'UA-54753018-4',
      qa: 'UA-54753018-4',
      ua: 'UA-54753018-4',
      staging: 'UA-54753018-4',
      production: 'UA-89558427-1',
    },
  },
};
