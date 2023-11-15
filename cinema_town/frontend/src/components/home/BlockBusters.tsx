import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Film from '../../models/Film';

const BlockBusters = ({
      films
    } : {
      films : Film[]
    }) => {

  const settings = {
    dots: true,
    infinite: true,
    /*fade: true,*/
    slidesToShow: 2,
    slidesToScroll: 2,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 10000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
    ]
  }



  return (
    <div className="block-busters-slider-container">
      <Slider {...settings}>
        {films.map((f, index) => {
          
          return  <div key={index} 
                    className='block-busters-img'>
                      <a href={`/film/${f.id}`}>
                        <img src={require(`../../assets/imgs/films-imgs/${f.id}/${f.picture}`)} alt={f.name}  />
                      </a>
                  </div>
          }
        )}
      </Slider>
    </div>
  );
};

export default BlockBusters
