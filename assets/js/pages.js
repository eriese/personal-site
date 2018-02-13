const pages = [
{
  "href": "/aspect",
  "state": "enoch.puppeteer.shows.aspect",
  "type" : "info",
  "scope": {
    "title": "Double Aspect Bright and Fair",
    "color": 1,
    "img": {
      "src": "./images/puppetry.jpg",
      "desc": "Lynn speaks to a death row inmate"
    },
    "text": "Presented as part of Eric Ehn's 17-play cycle, Soulographie: Our Genocides, a durational performance event looking at 20th century America’s relationships to genocides in the U.S. (the Tulsa Race Riot), East Africa (Rwanda and Uganda), and Central America (Guatemala and El Salvador).Double Aspect Bright and Fair was directed by Dan Hurlin and presented at Sarah Lawrence College, American Dance Institute, and LaMaMa, etc."
  }
},
{
  "href": "^/coder",
  "state": "enoch.coder",
  "type": "chart",
  "scope": {
    "title": "coder",
    "color": 1,
    "nexts": [
    {
      "title": "Processing and Arduino",
      "sref": "enoch.coder.processing",
    },
    {
      "title": "gitHub",
      "href": "http://www.github.com/eriese",
    },
    {
      "title": "Web",
      "sref": "enoch.coder.web"
    }
    ]
  }
},
{
  "href": "^/puppetry",
  "state": "enoch.puppeteer",
  "type": "chart",
  "scope": {
    "title": "Puppeteer",
    "color": 1,
    "nexts": [
    {
      "title": "Shows",
      "sref": "enoch.puppeteer.shows",
    },
    {
      "title": "Construction/ mechanical problemsolving",
    }
    ]
  }
},
{
  "href": "/food",
  "state": "enoch.puppeteer.shows.food",
  "type": "info",
  "scope": {
    "title": "Food for the Gods",
    "color": 1,
    "img": {
      "src": "./images/fftg1.jpg",
      "alt": "The dinner table",
      "desc": "The ancestors greet one another before the meal."
    },
    "text": "Food for the Gods was written and conceived by Nehprii Amenii in response to the killings of Troy Davis, Trayvon Martin, and Kimani Gray, and as a reaction to the statistic that every 36 hours a young black person in the United States is killed extrajudicially by a police officer, security guard, or self-appointed law enforcer."
  }
},
{
  "href": "/",
  "state": "enoch",
  "type": "chart",
  "scope": {
    "title": "Enoch Riese",
    "color": 0,
    "nexts": [
    {
      "title": "coder",
      "sref": "enoch.coder"
    },
    {
      "title": "puppeteer",
      "sref": "enoch.puppeteer"
    },
    {
      "title": "skill hoarder",
      "sref": "enoch.skills"
    }
    ]
  }
},
{
  "href": "/mouffe",
  "state": "enoch.puppeteer.shows.mouffe",
  "type": "info",
  "scope": {
    "title": "Bottom of the Mouffe",
    "color": 1,
    "video": {
      "src": "./video/mouffe.webmsd.webm",
      "id": "mouffe",
      "desc": "Click to watch"
    },
    "text": "A 12-minute Bunraku-style puppet piece conceived by Jeanette Plourde and performed to music and without text. Bottom of the Mouffe is a companion piece to La Cienaga. Four puppets are featured in the piece: two 36-inch puppets and two 25-inch puppets."
  }
},
{
  "href": "/processing",
  "state": "enoch.coder.processing",
  "type": "chart",
  "scope": {
    "title": "Processing and Arduino",
    "color": 0,
    "nexts": [
    {
      "title": "Closing Window",
      "href": "http://www.openprocessing.org/sketch/121624",
    },
    {
      "title": "Diminishing Returns",
      "href": "http://www.openprocessing.org/sketch/121625",
    },
    {
      "title": "Consequences",
      "href": "http://www.openprocessing.org/sketch/103537",
    },
    {
      "title": "The Swell",
      "href": "http://electronicenoch.tumblr.com",
    }
    ]
  }
},
{
  "href": "/web",
  "state": "enoch.coder.web",
  "type": "chart",
  "scope": {
    "title": "Web Apps",
    "color": 0,
    "nexts": [
    {
      "title": "Party Tag",
      "href": "http://www.thepartytag.com",
    },
    {
      "title": "BedPost",
      "href": "http://www.bedpost.me",
    }
    ]
  }
},
{
  "href": "/shows",
  "state": "enoch.puppeteer.shows",
  "type": "chart",
  "scope": {
    "title": "shows",
    "color": 0,
    "nexts": [
    {
      "title": "Bottom of the Mouffe",
      "sref": "enoch.puppeteer.shows.mouffe",
    },
    {
      "title": "Double Aspect Bright and Fair",
      "sref": "enoch.puppeteer.shows.aspect",
    },
    {
      "title": "Food for the Gods",
      "sref": "enoch.puppeteer.shows.food",
    }
    ]
  }
},
{
  "href": "^/skills",
  "state": "enoch.skills",
  "type": "info",
  "scope" : {
    "category": "skills",
    "title": "Skill Hoarder",
    "color": 1,
    "text": "Managerial: <strong>Conflict resolution</strong>, <strong>Curriculum writing</strong>, <strong>Workshop facilitation</strong>, Languages: <strong>English</strong>, <strong>Spanish</strong>, Editing: <strong>Copy and content</strong>, <strong>Sound (Garageband, Audacity)</strong>, Technical: <strong>Construction and carpentry</strong>, <strong>Light and sound board</strong>, <strong>Light hanging and focusing</strong>, <strong>Puppet design and construction</strong>, <strong>Basic circuitry</strong>, <strong>Mechanical problem-solving</strong>, Sewing: <strong>Costume design</strong>, <strong>Pattern-making</strong>, <strong>Sewing</strong>, <strong>Embroidery</strong>, <strong>Basic tailoring</strong>."
  }
}
];

export default pages;
