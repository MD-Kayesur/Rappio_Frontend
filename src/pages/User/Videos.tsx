import MediaFeed from '@/components/User/MediaFeed';

const Videos = () => {
    return (
        <div className="h-full w-full bg-black overflow-hidden relative">
            <MediaFeed type="video" />
        </div>
    );
};

export default Videos;