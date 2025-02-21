import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
function About() {
  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg ">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-rose-600">
          About Baby Bliss
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Brand</h2>
          <p className="text-gray-700 leading-relaxed">
            We are proud to bring you the highest quality baby products with a
            focus on comfort, safety, and care. Our mission is to make parenting
            easier and more enjoyable for you and your little one. Join us in
            making every moment special!
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Our Collaboration with Trusted Brands
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We’ve teamed up with some of the most trusted brands in the baby
            product industry to bring you high-quality, safe, and reliable
            products for your little one. Our collaboration ensures that every
            product is made with care and meets the highest standards.
          </p>
          <div className="mt-4">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={10}
              slidesPerView={4}
              loop={true}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="rounded-lg shadow"
            >
              <SwiperSlide>
                <img
                  src="https://99designs-blog.imgix.net/blog/wp-content/uploads/2019/06/attachment_46610735-e1559588144596.png?auto=format&q=60&fit=max&w=930"
                  alt="Brand 1"
                  className="w-24 h-24 object-cover rounded-lg shadow"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT97Zzkb5J9Fasqro-Sy9t5Z8ztXnS5JkOgwj3A109WIsVleshXUallpHznyFeJOwBnT7o&usqp=CAU"
                  alt="Brand 2"
                  className="w-24 h-24 object-cover rounded-lg shadow"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoTgGEv6BVp936hOghL7rH82rkXrDJ6d15qg&s"
                  alt="Brand 3"
                  className="w-24 h-24 object-cover rounded-lg shadow"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqIAc1HyHJN0zKB7IpnZGf_8nH0Tixbfr2PA&s"
                  alt="Brand 1"
                  className="w-24 h-24 object-cover rounded-lg shadow"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcHZ3IpL5sfIHjTEvHH8JTP3h9ed6Kv-Dxdw&s"
                  alt="Brand 2"
                  className="w-24 h-24 object-cover rounded-lg shadow"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ309Ajj2BKHbP1SkaFe3a1-JklCyq5xxLemFr76p760IsB2O0dqSXzTIll1Owm9eeIAzo&usqp=CAU"
                  alt="Brand 3"
                  className="w-24 h-24 object-cover rounded-lg shadow"
                />
              </SwiperSlide>
            </Swiper>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            What Our Customers Are Saying
          </h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            
          >
            <SwiperSlide>
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Samantha J.</strong> - Verified Buyer
                  <br />
                  "I absolutely love these products! My baby has never been more
                  comfortable, and I feel so confident knowing that they’re
                  safe. Highly recommend!"
                </p>
                <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <p className="text-gray-700 leading-relaxed">
                  <strong>James W.</strong> - Verified Buyer
                  <br />
                  "These baby products are amazing! The quality is unbeatable,
                  and my baby loves the comfort they provide. I will definitely
                  be coming back for more!"
                </p>
                <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Emily R.</strong> - Verified Buyer
                  <br />
                  "I’ve tried many baby products before, but these are by far
                  the best! The designs are so cute, and the quality is
                  top-notch. My baby loves them!"
                </p>
                <div className="text-yellow-500 mb-3">⭐⭐⭐⭐</div>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>
      </div>
    </div>
  );
}

export default About;
