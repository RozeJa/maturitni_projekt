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
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 10000
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
