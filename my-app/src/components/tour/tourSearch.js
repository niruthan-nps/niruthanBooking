import { Fragment, useEffect, useState } from "react";
import Tour from ".././tour/tour";
import { useDispatch, useSelector } from 'react-redux';
import { getTours } from "../../actions/tourAction";
import { toast } from 'react-toastify';
import MetaData from ".././layouts/MetaData";
import Pagination from 'react-js-pagination';
import Loader from '.././layouts/loader';
import { useParams } from "react-router-dom";
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';




export default function TourSearch() {

    const dispatch = useDispatch();
    const { tours, toursCount, resPerPage, loading, error } = useSelector((state) => state.toursState)
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([1, 25000]);
    const [priceChanged, setPriceChanged] = useState(price);
    const [category, setCategory] = useState(null);
    const [rating, setRating] = useState(0);
    const { keyword } = useParams();
    const categories = [
        'Historical',
        'Adventure',
        'Nature',
        'Cultural',
        'Beach',
        'Mountain',
        'Wildlife',
        'City Tour',
        'Heritage',
        'Religious',
        'Eco-Tourism',
        'Cruise'
    ];

    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo)
    }

    useEffect(() => {
        dispatch(getTours(keyword, priceChanged, category, rating, currentPage))
    }, [dispatch, currentPage, keyword, priceChanged, category, rating]);

    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: "bottom-center"
            });
        }
    }, [error])


    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={'Search Tours'} />
                    <h1 id="products_heading">Search Tours</h1>

                    <section id="products" className="container mt-5">
                        <div className="row">
                        <div className="col-6 col-md-3 mb-5 mt-5">
                                {/* Price Filter */}
                                <div className="px-5" onMouseUp={() => setPriceChanged(price)}>
                                    <Slider
                                        range={true}
                                        marks={{
                                            1: "Rs.1",
                                            25000: "Rs.25000"
                                        }}
                                        min={1}
                                        max={25000}
                                        defaultValue={price}
                                        onChange={(price) => {
                                            setPrice(price)
                                        }}
                                        handleRender={renderProps => {
                                            return (
                                                <Tooltip overlay={`Rs.${renderProps.props['aria-valuenow']}`}>
                                                    <div {...renderProps.props}></div>
                                                </Tooltip>
                                            )
                                        }}
                                    />
                                </div>
                                <hr className="my-5" />
                                {/* Category Filter */}
                                <div className="mt-5">
                                    <h3 className="mb-3">Categories</h3>
                                    <ul className="pl-0">
                                        {categories.map(category =>
                                            <li
                                                style={{
                                                    cursor: 'pointer',
                                                    listStyleType: 'none'
                                                }}
                                                key={category}
                                                onClick={()=>{
                                                    setCategory(category)
                                                }}
                                            >
                                                {category}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <hr className="my-5" />
                                {/* Ratings Filter */}
                                <div className="mt-5">
                                        <h4 className="mb-3">Ratings</h4>
                                        <ul className="pl-0">
                                        {[5,4,3,2,1].map(star =>
                                            <li
                                                style={{
                                                    cursor: 'pointer',
                                                    listStyleType: 'none'
                                                }}
                                                key={star}
                                                onClick={()=>{
                                                    setRating(star)
                                                }}
                                            >
                                                <div className="rating-outer">
                                                    <div className="rating-inner" style={{width : `${star * 20}%`}}></div>
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>     
                            </div>
                            <div className="col-6 col-md-9">
                                <div className="row">
                                    {tours && tours.map(tour => (
                                        <Tour col={4} key={tour._id} tour={tour} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                    {toursCount > 0 && toursCount > resPerPage ?
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                onChange={setCurrentPageNo}
                                totalItemsCount={toursCount}
                                itemsCountPerPage={resPerPage}
                                nextPageText={'next'}
                                firstPageText={'first'}
                                lastPageText={'last'}
                                itemClass={'page-item'}
                                linkClass={'page-link'}
                            />
                        </div>
                        : null}

                </Fragment>
            }
        </Fragment>
    )
}