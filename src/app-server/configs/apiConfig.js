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
      items: [
        'surveys',
        'my-events',
        'membership-info',
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
        'get-involved-onboarding',
        'done',
      ],
    },
    events: {
      title: 'Events',
      subTitle: 'View and register for NFIB events',
      url: '/events',
      icon: 'event',
    },
    'membership-info': {
      title: 'Membership Information',
      url: '/account/edit',
      icon: 'business_center',
    },
    surveys: {
      title: 'My Ballots & Surveys',
      url: '/account/surveys',
      icon: 'thumbs_up_down',
    },
    'my-events': {
      title: 'My Events',
      url: '/account/events',
      icon: 'person_pin',
    },
    transactions: {
      title: 'My Transactions',
      url: '/account/transactions',
      icon: 'attach_money',
    },
    'get-involved': {
      title: 'Get Involved',
      url: '/account/get-involved',
      icon: 'explore',
    },
    'get-involved-onboarding': {
      title: 'Get Involved',
      url: '/account/onboarding/get-involved',
      icon: 'explore',
      component: 'GetInvolved',
      progress: {
        stepType: 'GetInvolved',
        hasCompleted: true,
      },
    },
    privacy: {
      title: 'Privacy Settings',
      url: '/account/privacy',
      icon: 'phonelink_lock',
      roles: ['PrimaryContact'],
    },
    'preference-center': {
      title: 'Communication Preferences',
      url: '/account/preferences',
      icon: 'chat',
    },
    password: {
      title: 'Create Password',
      url: '/account/onboarding/password',
      component: 'CreatePassword',
    },
    'business-address': {
      title: 'Business Address',
      url: '/account/onboarding/business-address',
      component: 'BusinessAddress',
      progress: {
        stepType: 'BusinessAddress',
        hasCompleted: true,
      },
    },
    'topics-of-concern': {
      title: 'Grassroots Advocacy',
      url: '/account/onboarding/topics-of-concern',
      component: 'Topics',
      progress: {
        stepType: 'TopicsOfConcern',
        hasCompleted: true,
      },
    },
    'my-representatives': {
      title: 'My Elected Representatives',
      url: '/account/onboarding/my-representatives',
      component: 'Representatives',
    },
    done: {
      url: '/account/onboarding/thank-you',
      component: 'Completed',
      title: 'Done',
      bodyTitle: 'Thank you',
      bodyText:
        'The information you provided will help NFIB serve you better.\nWhere would you like to go next?',
      actions: {
        ballots: {
          label: 'Vote My Ballot',
          primary: true,
          raised: true,
          to: '/account/surveys',
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
          to: '/account',
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
      url: '/account/surveys/thank-you',
      title: 'Done',
      bodyTitle: 'Thank you',
      bodyText:
        'Your responses have been captured and we appreciate you making your voice heard!',
      actions: {
        ballots: {
          label: 'Back To My Ballots & Surveys',
          primary: true,
          raised: true,
          to: '/account/surveys',
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
