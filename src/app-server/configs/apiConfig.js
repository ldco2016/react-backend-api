module.exports = {
  pages: {
    home: {
      title: 'Home',
      items: ['events', 'account'],
    },
    account: {
      title: 'Account Management',
      subTitle: 'View and edit your details',
      url: '/account',
      icon: 'account_circle',
      color: 'orange',
      items: [
        'membership-info',
        'my-events',
        'surveys',
        'transactions',
        'get-involved',
        'privacy',
        'preference-center',
      ],
    },
    onboarding: {
      title: 'Member Federation',
      items: [
        'password',
        'business-address',
        'topics-of-concern',
        'my-representatives',
        'get-involved',
        'done',
      ],
    },
    events: {
      title: 'Events',
      subTitle: 'View and register for NFIB events',
      url: '/events',
      icon: 'event',
      color: 'blue',
    },
    'membership-info': {
      title: 'Membership Info',
      url: 'edit',
      icon: 'business_center',
      color: 'blue',
    },
    surveys: {
      title: 'My Ballots & Surveys',
      url: 'surveys',
      icon: 'thumbs_up_down',
      color: 'grey',
    },
    'my-events': {
      title: 'My Events',
      url: 'events',
      icon: 'person_pin',
      color: 'teal',
    },
    transactions: {
      title: 'My Transactions',
      url: 'transactions',
      icon: 'attach_money',
      color: 'green',
    },
    'get-involved': {
      title: 'Get Involved',
      url: 'get-involved',
      icon: 'explore',
      color: 'orange',
      component: 'GetInvolved',
      progress: {
        stepType: 'GetInvolved',
        hasCompleted: true,
      },
    },
    privacy: {
      title: 'Privacy Settings',
      url: 'privacy',
      icon: 'phonelink_lock',
      color: 'red',
      roles: ['PrimaryContact'],
    },
    'preference-center': {
      title: 'Communication Preferences',
      url: 'preferences',
      icon: 'chat',
      color: 'purple',
    },
    password: {
      title: 'Create Password',
      url: 'password',
      component: 'CreatePassword',
      color: 'red',
    },
    'business-address': {
      title: 'Business Address',
      url: 'business-address',
      component: 'BusinessAddress',
      color: 'blue',
      progress: {
        stepType: 'BusinessAddress',
        hasCompleted: true,
      },
    },
    'topics-of-concern': {
      title: 'Grassroots Advocacy',
      url: 'topics-of-concern',
      component: 'Topics',
      color: 'green',
      progress: {
        stepType: 'TopicsOfConcern',
        hasCompleted: true,
      },
    },
    'my-representatives': {
      title: 'My Elected Representatives',
      url: 'my-representatives',
      component: 'Representatives',
      color: 'teal',
    },
    done: {
      url: 'thank-you',
      component: 'Completed',
      color: 'purple',
      title: 'Done',
      bodyTitle: 'Thank you',
      bodyText:
        'The information you provided will help NFIB serve you better.\nWhere would you like to go next?',
      actions: {
        ballots: {
          label: 'Vote My Ballot',
          primary: true,
          raised: true,
          to: 'surveys',
          style: {
            width: '100%',
            display: 'block',
            margin: '1rem auto',
          },
        },
        advocacy: {
          label: 'Advocacy',
          primary: true,
          raised: true,
          to: '/redirect/advocacy',
          style: {
            width: '100%',
            display: 'block',
            margin: '1rem auto',
          },
        },
        account: {
          label: 'My Account',
          primary: true,
          raised: true,
          to: '',
          style: {
            width: '100%',
            display: 'block',
            margin: '1rem auto',
          },
        },
        events: {
          label: 'Events',
          primary: true,
          raised: true,
          to: '/events',
          style: {
            width: '100%',
            display: 'block',
            margin: '1rem auto 0',
          },
        },
      },
    },
    surveyCompleted: {
      url: 'thank-you',
      color: 'blue',
      title: 'Done',
      bodyTitle: 'Thank you',
      bodyText:
        'Your responses have been captured and we appreciate you making your voice heard!',
      actions: {
        ballots: {
          label: 'Back To My Ballots & Surveys',
          primary: true,
          raised: true,
          to: 'surveys',
          style: {
            display: 'block',
            margin: '1rem auto 0',
          },
        },
      },
    },
    join: {},
  },
};
