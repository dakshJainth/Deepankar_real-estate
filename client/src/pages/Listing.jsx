import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle';

export const Listing = () => {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(()=>{
        const fetchListing = async () =>{
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
    
                if(data.success === false){
                    setError(true);
                    return;
                }
    
                setListing(data);
                setLoading(false);
                
            } catch (error) {
                setLoading(false);
                setError(true);
            }
        };

        fetchListing();
    },[params.listingId])

  return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
        {error && <p className='text-center my-7 text-2xl'>Something Went Wrong</p>}

        {listing && !loading && !error && (
            <div>
            <Swiper navigation>
                {listing.imageUrls && listing.imageUrls.map((url)=>(
                    <SwiperSlide key={url}>
                        <div className='h-[550px]' style={{background: `url(${url}) center no-repeat`}}>
                           
                        </div>
                    </SwiperSlide>
                ))}

            </Swiper>
            </div>
        )}
    </main>
  )
}
