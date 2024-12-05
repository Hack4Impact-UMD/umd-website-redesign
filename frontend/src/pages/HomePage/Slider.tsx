import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import styles from './HomePage.module.css';
const SliderComp = () => {
  const testimonials = [
    { npoName: 'NPO 1', testimonial: 'This is the random content of the slide blah lahs dbaksnd asd iajdasd.' },
    { npoName: 'NPO 1', testimonial: 'This is the random content of the slide blah lahs dbaksnd asd iajdasd.' },
    { npoName: 'NPO 1', testimonial: 'This is the random content of the slide blah lahs dbaksnd asd iajdasd.' },
    { npoName: 'NPO 1', testimonial: 'This is the random content of the slide blah lahs dbaksnd asd iajdasd.' },
    { npoName: 'NPO 1', testimonial: 'This is the random content of the slide blah lahs dbaksnd asd iajdasd.' },
    { npoName: 'NPO 1', testimonial: 'This is the random content of the slide blah lahs dbaksnd asd iajdasd.' },
    { npoName: 'NPO 1', testimonial: 'This is the random content of the slide blah lahs dbaksnd asd iajdasd.' },
  ];
  const settings = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '60px',
    slidesToShow: 3,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'linear',
    nextArrow: <></>,
    prevArrow: <></>,
    dots: true,
  };
  const [activeIndex, setActiveIndex] = useState(0);
  console.log(activeIndex);

  return (
    <div className={styles.slideOutsideContainer}>
      <div className={styles.slideInsideContainer}>
        <Slider {...settings} beforeChange={(_before: any, after) => setActiveIndex(after)}>
          {testimonials.map((report, index) => {
            return (
              <div key={index} className={index == activeIndex ? styles.activeSlide : styles.inactiveSlide}>
                <h3 className={styles.slideTitle}>{report.npoName}</h3>
                <p className={styles.slideContent}>{report.testimonial}</p>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default SliderComp;
