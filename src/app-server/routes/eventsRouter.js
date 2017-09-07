const Router = require('express').Router;
const bodyParser = require('body-parser');

const ENCODING = {
  QUOTED: 'quoted-printable',
  NONE: 'none',
};
const getConfirmationLink = (url, { encoding = ENCODING.NONE } = {}) => {
  if (encoding === ENCODING.QUOTED) {
    return url.replace(/=/g, '=3D');
  }
  return url;
};

const buildCalendarEvent = data => {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `URL:${getConfirmationLink(data.confirmationUrl)}`,
    `DTSTART:${data.eventStart}`,
    `DTEND:${data.eventEnd}`,
    `SUMMARY:${data.eventTitle}`,
    `DESCRIPTION;ENCODING=QUOTED-PRINTABLE:${data.eventShortDescription}=0D=0AEvent Confirmation: ${getConfirmationLink(
      data.confirmationUrl,
      { encoding: ENCODING.QUOTED }
    )}`,
    `LOCATION: ${data.eventLocation}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\n');
};

module.exports = () => {
  const router = Router();
  router.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  router.use(bodyParser.json());
  router.post('/:eventId/confirmation/calendar', (req, res) => {
    res.setHeader('content-type', 'text/calendar');
    res.send(buildCalendarEvent(req.body));
  });
  return router;
};
