/* =====================================================================
Form validation
===================================================================== */
const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const submitBtn = document.querySelector('.contact-submit');
const validFeedback = document.querySelectorAll('.valid-feedback');
const invalidFeedback = document.querySelectorAll('.invalid-feedback');

async function handleSubmit(e) {
  e.preventDefault();

  myForm = e.target;
  const formData = new FormData(myForm);

  const inputs = [
    { input: document.querySelector('#name') },
    { input: document.querySelector('#email') },
    { input: document.querySelector('#message') },
  ];

  if (submitBtn.classList.contains('sent-btn')) {
    submitBtn.textContent = 'SEND MESSAGE';
    submitBtn.classList.remove('sent-btn');
  }

  if (inputs[0].input.value.trim() === '') {
    invalidate(inputs[0].input, 0);
  } else {
    validate(inputs[0].input, 0);
  }

  if (
    inputs[1].input.value.trim() === '' ||
    !inputs[1].input.value.match(mailFormat)
  ) {
    invalidate(inputs[1].input, 1);
  } else {
    validate(inputs[1].input, 1);
  }

  if (inputs[2].input.value.trim() === '') {
    invalidate(inputs[2].input, 2);
  } else {
    validate(inputs[2].input, 2);
  }

  checkAllCorrect(inputs, formData);
}

function invalidate(input, index) {
  input.classList.remove('is-valid');
  validFeedback[index].classList.add('hidden');
  input.classList.add('is-invalid');
  invalidFeedback[index].classList.remove('hidden');
}

function validate(input, index) {
  input.classList.remove('is-invalid');
  invalidFeedback[index].classList.add('hidden');
  input.classList.add('is-valid');
  validFeedback[index].classList.remove('hidden');
}

function checkAllCorrect(inputs, formData) {
  if (
    inputs[0].input.classList.contains('is-valid') &&
    inputs[1].input.classList.contains('is-valid') &&
    inputs[2].input.classList.contains('is-valid')
  ) {
    // Submit the form
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => null)
      .catch((err) => console.log(err));

    submitBtn.textContent = 'MESSAGE SENT!';
    submitBtn.classList.add('sent-btn');

    inputs.forEach((field) => {
      field.input.classList.remove('is-valid');
      field.input.classList.remove('is-invalid');
      field.input.value = '';
    });

    inputs[2].input.style.height = '107px';
  }
}

/* =====================================================================
Project overlays
===================================================================== */
function handleOverlay(e) {
  if (window.matchMedia('screen and (min-width: 1110px)').matches) {
    const overlay = e.target.children[1];

    overlay.classList.contains('enabled')
      ? overlay.classList.remove('enabled')
      : overlay.classList.add('enabled');
  }
}

/* =====================================================================
Check elements in viewport
===================================================================== */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();

  return (
    rect.right >= 0 &&
    rect.left >= 0 &&
    // rect.bottom >= 0 && // Elements re-animating when scrolling up
    rect.top <= (window.innerHeight || document.documentElement.clientHeight)
  );
}

function checkCardPos() {
  const projectItems = [
    {
      element: document.querySelectorAll('.project-card'),
      name: 'card-show',
    },
    {
      element: document.querySelectorAll('.project-details h3'),
      name: 'card-title-show',
    },
    {
      element: document.querySelectorAll('.project-tags'),
      name: 'card-tags-show',
    },
    {
      element: document.querySelectorAll('.project-links'),
      name: 'card-links-show',
    },
  ];

  projectItems.forEach((item) => {
    const { element, name } = item;

    element.forEach((el) => {
      isInViewport(el) ? el.classList.add(name) : el.classList.remove(name);
    });
  });
}

function checkLogoPos() {
  const logos = document.querySelectorAll('.experience');

  logos.forEach((logo) => {
    if (
      window.matchMedia('(max-width: 767px)').matches &&
      isInViewport(logos[4])
    ) {
      logo.classList.add('logo-show');
    } else if (isInViewport(logos[logos.length - 1])) {
      logo.classList.add('logo-show');
    }
  });
}

function checkElPos() {
  checkCardPos();
  checkLogoPos();
}

/* =====================================================================
Typewriter effect
===================================================================== */
class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = JSON.parse(words);
    this.wait = parseInt(wait, 10); // base 10 number
    this.isDeleting = false;
    this.wordIndex = 0;
    this.txt = 'Alex Morgan';
    this.type();
  }

  type() {
    // get current word
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    // add/remove chars
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // insert text
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    let typeSpeed = 300;
    if (this.isDeleting) typeSpeed /= 2;

    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait; // add pause at end
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed); // integrate the typespeed
  }
}

function initTypeWriter() {
  const txtElement = document.querySelector('.about-name');
  const words = txtElement.getAttribute('data-words');
  const wait = txtElement.getAttribute('data-wait');

  new TypeWriter(txtElement, words, wait);
}

/* =====================================================================
Event listeners
===================================================================== */
const projectImage = document.querySelectorAll('.image-container');
projectImage.forEach((image) => {
  image.addEventListener('mouseenter', handleOverlay);
  image.addEventListener('mouseleave', handleOverlay);
  // image.addEventListener('touchstart', handleOverlay);
  window.addEventListener('touchcancel', handleOverlay);
});

const contactForm = document
  .querySelector('.contact-form')
  .addEventListener('submit', handleSubmit);

window.addEventListener('load', checkElPos);
window.addEventListener('resize', checkElPos);
window.addEventListener('scroll', checkElPos);
document.addEventListener('DOMContentLoaded', initTypeWriter);

/* =====================================================================
Canvas Dots (Script from bscottnz: http://tinyurl.com/2xu8cr78)
===================================================================== */
const canvasDots = function () {
  const canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d'),
    colorDot = [
      'rgb(81, 162, 233)',
      'rgb(81, 162, 233)',
      'rgb(81, 162, 233)',
      'rgb(81, 162, 233)', // here and above is blue
      'rgb(255, 77, 90)', // here is yellow
    ], // 80% of dots are blue. 20% yellow
    color = 'rgb(81, 162, 233)';

  // ctx.globalAlpha = 0.8;
  canvas.width = document.body.scrollWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';
  // ctx.fillStyle = colorDot;
  // ctx.fillStyle = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
  ctx.lineWidth = 0.3;
  ctx.strokeStyle = color;

  let mousePosition = {
    x: (30 * canvas.width) / 100,
    y: (30 * canvas.height) / 100,
  };

  const windowSize = window.innerWidth;
  let dots;

  if (windowSize > 1600) {
    dots = {
      nb: 600, // number of particles
      distance: 70, // max distance between particles for them to link
      d_radius: 300, // radius from mouse location that particles will link
      array: [],
    };
  } else if (windowSize > 1300) {
    dots = {
      nb: 575,
      distance: 60,
      d_radius: 280,
      array: [],
    };
  } else if (windowSize > 1100) {
    dots = {
      nb: 500,
      distance: 55,
      d_radius: 250,
      array: [],
    };
  } else if (windowSize > 800) {
    dots = {
      nb: 300,
      distance: 50,
      d_radius: 230,
      array: [],
    };
  } else if (windowSize > 600) {
    dots = {
      nb: 200,
      distance: 0,
      d_radius: 0,
      array: [],
    };
  } else {
    dots = {
      nb: 100,
      distance: 0,
      d_radius: 0,
      array: [],
    };
  }

  // decided to turn off connecting dots under 1100px

  // } else if (windowSize > 650) {
  //   dots = {
  //     nb: 400,
  //     distance: 50,
  //     d_radius: 185,
  //     array: [],
  //   };
  // } else if (windowSize > 500) {
  //   dots = {
  //     nb: 325,
  //     distance: 45,
  //     d_radius: 170,
  //     array: [],
  //   };
  // } else {
  //   dots = {
  //     nb: 270,
  //     distance: 45,
  //     d_radius: 140,
  //     array: [],
  //   };
  // }

  function Dot() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.vx = -0.5 + Math.random();
    this.vy = -0.5 + Math.random();

    this.radius = Math.random() * 1.5;

    // this.colour = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
    this.colour = colorDot[Math.floor(Math.random() * colorDot.length)];
  }

  Dot.prototype = {
    create: function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      // ctx.fillStyle = this.colour;

      // make the dot colour fade out the further they are from the mouse
      const dotDistance =
        ((this.x - mousePosition.x) ** 2 + (this.y - mousePosition.y) ** 2) **
        0.5;
      const distanceRatio = dotDistance / (windowSize / 1.7);

      // this chops the bracket off the rgb colour and ads an opacity
      ctx.fillStyle = this.colour.slice(0, -1) + `,${1 - distanceRatio})`;

      ctx.fill();
    },

    animate: function () {
      // dont animate the first dot, it will follow mouse
      for (let i = 1; i < dots.nb; i++) {
        const dot = dots.array[i];

        if (dot.y < 0 || dot.y > canvas.height) {
          dot.vx = dot.vx;
          dot.vy = -dot.vy;
        } else if (dot.x < 0 || dot.x > canvas.width) {
          dot.vx = -dot.vx;
          dot.vy = dot.vy;
        }
        dot.x += dot.vx;
        dot.y += dot.vy;
      }
    },

    line: function () {
      for (let i = 0; i < dots.nb; i++) {
        for (let j = 0; j < dots.nb; j++) {
          const i_dot = dots.array[i];
          const j_dot = dots.array[j];

          if (
            i_dot.x - j_dot.x < dots.distance &&
            i_dot.y - j_dot.y < dots.distance &&
            i_dot.x - j_dot.x > -dots.distance &&
            i_dot.y - j_dot.y > -dots.distance
          ) {
            if (
              i_dot.x - mousePosition.x < dots.d_radius &&
              i_dot.y - mousePosition.y < dots.d_radius &&
              i_dot.x - mousePosition.x > -dots.d_radius &&
              i_dot.y - mousePosition.y > -dots.d_radius
            ) {
              ctx.beginPath();
              ctx.moveTo(i_dot.x, i_dot.y);
              ctx.lineTo(j_dot.x, j_dot.y);

              // make the fill colour fade out the further you are from the mouse
              const dotDistance =
                ((i_dot.x - mousePosition.x) ** 2 +
                  (i_dot.y - mousePosition.y) ** 2) **
                0.5;
              let distanceRatio = dotDistance / dots.d_radius;

              // make it so it doesnt fade out completely
              distanceRatio -= 0.3;
              if (distanceRatio < 0) {
                distanceRatio = 0;
              }

              ctx.strokeStyle = `rgb(81, 162, 233, ${1 - distanceRatio})`;

              ctx.stroke();
              ctx.closePath();
            }
          }
        }
      }
    },
  };

  function createDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < dots.nb; i++) {
      dots.array.push(new Dot());
      var dot = dots.array[i];

      dot.create();
    }

    // first dot to be relativley large
    dots.array[0].radius = 1.5;

    // first dot to be blue
    dots.array[0].colour = '#51a2e9';

    dot.line();
    dot.animate();
  }

  window.onmousemove = function (parameter) {
    mousePosition.x = parameter.pageX;
    mousePosition.y = parameter.pageY;

    // sometimes if the mouse is off screen on refresh, it bugs out
    try {
      // want the first dot to follow the mouse
      dots.array[0].x = parameter.pageX;
      dots.array[0].y = parameter.pageY;
    } catch {
      //
    }
  };

  mousePosition.x = window.innerWidth / 2;
  mousePosition.y = window.innerHeight / 2;

  const draw = setInterval(createDots, 1000 / 30);

  window.onresize = function () {
    clearInterval(draw);
    canvasDots();
    // console.log(yippe);
  };
};
canvasDots();
