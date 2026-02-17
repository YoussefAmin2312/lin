interface Store {
  name: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}

const stores: Store[] = [
  {
    name: "LINEA Dubai Mall",
    address: "The Dubai Mall, Fashion Avenue, Downtown Dubai",
    phone: "+971 4 555 0123",
    hours: "Sun-Thu: 10AM-10PM, Fri-Sat: 10AM-12AM",
    lat: 25.1972,
    lng: 55.2744
  },
  {
    name: "LINEA Mall of the Emirates",
    address: "Mall of the Emirates, Al Barsha, Dubai",
    phone: "+971 4 555 0456",
    hours: "Sun-Thu: 10AM-10PM, Fri-Sat: 10AM-12AM",
    lat: 25.1182,
    lng: 55.2008
  },
  {
    name: "LINEA City Walk",
    address: "City Walk, Al Wasl, Dubai",
    phone: "+971 4 555 0789",
    hours: "Sun-Thu: 10AM-10PM, Fri-Sat: 10AM-12AM",
    lat: 25.2048,
    lng: 55.2608
  }
];

const StoreMap = () => {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-border bg-muted/10 relative">
      {/* Static Map using Google Maps Embed API - Dubai */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115771.02828012498!2d55.13428445!3d25.197201349999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sus!4v1641234567890!5m2!1sen!2sus"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full"
      />
      
      {/* Overlay with store markers */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 max-w-xs">
        <h4 className="text-sm font-medium text-foreground mb-3">Our Locations</h4>
        <div className="space-y-2">
          {stores.map((store, index) => (
            <div key={index} className="text-xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <span className="font-medium text-foreground">{store.name}</span>
              </div>
              <p className="text-muted-foreground ml-4">{store.address}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreMap;
