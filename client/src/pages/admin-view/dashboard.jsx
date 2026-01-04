import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages, deleteFeatureImage } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList, isLoading } = useSelector((state) => state.commonFeature);


  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    console.log(id);

    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);


  return (
    <div className="flex flex-col items-center">
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}

        // isEditMode={currentEditedId !== null}
        isCustomStyling={false}
      />
      <Button onClick={handleUploadFeatureImage} disabled={!uploadedImageUrl} className="mt-5 inline-flex gap-2 items-center px-4 py-2 text-sm font-medium rounded-full cursor-pointer bg-black text-white border-2 border-transparent shadow
               hover:bg-white hover:text-black hover:border-black hover:rounded-full
               transition-all duration-300 ease-in-out w-full max-w-md disabled:opacity-50 disabled:cursor-not-allowed">
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5 w-full max-w-md">
        {isLoading ? (
          // Render 3 skeleton items for feature images
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="relative">
              <Skeleton className="w-full h-[300px] rounded-t-lg bg-gray-200" />
            </div>
          ))
        ) : featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
            <div className="relative">
              <img
                src={featureImgItem.image}
                className="w-full h-auto object-cover rounded-t-lg"
              />
              <Button
                onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 h-8 w-8 flex items-center justify-center">
                <span className="sr-only">Delete</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" x2="10" y1="11" y2="17"></line>
                  <line x1="14" x2="14" y1="11" y2="17"></line>
                </svg>
              </Button>
            </div>
          ))
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;