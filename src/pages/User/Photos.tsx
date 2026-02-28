import MediaFeed from '@/components/User/MediaFeed';

const Photos = () => {
    return (
        <div className="h-full w-full bg-background overflow-hidden relative">
            <MediaFeed type="photo" />
        </div>
    );
};

export default Photos;