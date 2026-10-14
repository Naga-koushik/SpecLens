import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePhone } from '../hooks/usePhone';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { SpecSection } from '../components/phone/SpecSection';
import { SpecSectionSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  Smartphone,
  Plus,
  Scale,
  Calendar,
  Cpu,
  Tv,
  HardDrive,
  Camera,
  Battery,
  Wifi,
  Radio,
  Layers,
  Box,
  Check
} from 'lucide-react';

export const PhoneDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: phone, isLoading, isError, error, refetch } = usePhone(id);
  const { addRecentlyViewed } = useRecentlyViewed();
  const [imageError, setImageError] = useState(false);
  const [isAddedToCompare, setIsAddedToCompare] = useState(false);

  // Track into recently viewed when successfully loaded
  useEffect(() => {
    if (phone) {
      addRecentlyViewed({
        id: phone.id,
        name: phone.name,
        brand: phone.brand,
        thumbnail: phone.image,
        highlights: [
          phone.display?.size || '',
          phone.processor?.chipset || '',
          phone.battery?.capacity || ''
        ].filter(Boolean)
      });
    }
  }, [phone, addRecentlyViewed]);

  const handleCompareClick = () => {
    if (!phone) return;
    setIsAddedToCompare(true);
    navigate(`/compare?ids=${phone.id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
        <SpecSectionSkeleton />
        <SpecSectionSkeleton />
        <SpecSectionSkeleton />
      </div>
    );
  }

  if (isError || !phone) {
    const is404 = (error as any)?.status === 404 || (error as any)?.code === 'NOT_FOUND';
    return (
      <ErrorState
        title={is404 ? 'Phone Not Found' : 'Error Loading Phone Specifications'}
        message={
          is404
            ? `We couldn't find a smartphone with ID "${id}". It may have been removed or does not exist.`
            : (error as any)?.message || 'Failed to retrieve phone specifications.'
        }
        code={is404 ? 'NOT_FOUND' : undefined}
        onRetry={!is404 ? () => refetch() : undefined}
        showHomeButton
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Phone Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Phone Image */}
          <div className="w-56 h-72 bg-slate-50 rounded-2xl flex items-center justify-center p-6 border border-slate-100 shrink-0">
            {!imageError && phone.image ? (
              <img
                src={phone.image}
                alt={`${phone.brand} ${phone.name}`}
                onError={() => setImageError(true)}
                className="max-h-full max-w-full object-contain drop-shadow-md"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-300">
                <Smartphone className="w-20 h-20 mb-2" />
                <span className="text-xs text-slate-400 font-medium">Image unavailable</span>
              </div>
            )}
          </div>

          {/* Phone Title & Key Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <Link
                to={`/brands/${phone.brand.toLowerCase()}`}
                className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full hover:bg-emerald-100 transition-colors mb-2"
              >
                {phone.brand}
              </Link>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {phone.name}
              </h1>
              {phone.releaseDate && (
                <p className="text-xs text-slate-500 flex items-center justify-center md:justify-start gap-1 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Announced: {phone.releaseDate}</span>
                </p>
              )}
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              {phone.display?.size && (
                <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg">
                  {phone.display.size} Screen
                </span>
              )}
              {phone.processor?.chipset && (
                <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg">
                  {phone.processor.chipset.split('(')[0]?.trim()}
                </span>
              )}
              {phone.battery?.capacity && (
                <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg">
                  {phone.battery.capacity} Battery
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                type="button"
                onClick={handleCompareClick}
                className="min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                {isAddedToCompare ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Compare</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Compare</span>
                  </>
                )}
              </button>
              <Link
                to={`/compare?ids=${phone.id}`}
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <Scale className="w-4 h-4" />
                <span>Compare Side-by-Side</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Specification Sections */}
      <div className="space-y-4">
        {/* 1. Overview */}
        <SpecSection
          title="Overview"
          icon={<Smartphone className="w-5 h-5" />}
          items={[
            { label: 'Device Model', value: phone.name },
            { label: 'Manufacturer', value: phone.brand },
            { label: 'Release Date', value: phone.releaseDate },
            { label: 'Dimensions', value: phone.dimensions },
            { label: 'Weight', value: phone.weight },
            { label: 'Operating System', value: phone.operatingSystem }
          ]}
        />

        {/* 2. General */}
        <SpecSection
          title="General"
          icon={<Layers className="w-5 h-5" />}
          items={[
            { label: 'Brand', value: phone.brand },
            { label: 'Announced Date', value: phone.releaseDate },
            { label: 'Operating System', value: phone.operatingSystem }
          ]}
        />

        {/* 3. Display */}
        <SpecSection
          title="Display"
          icon={<Tv className="w-5 h-5" />}
          items={[
            { label: 'Display Type', value: phone.display?.type },
            { label: 'Screen Size', value: phone.display?.size },
            { label: 'Resolution', value: phone.display?.resolution },
            { label: 'Refresh Rate', value: phone.display?.refreshRate },
            { label: 'Glass Protection', value: phone.display?.protection }
          ]}
        />

        {/* 4. Performance */}
        <SpecSection
          title="Performance"
          icon={<Cpu className="w-5 h-5" />}
          items={[
            { label: 'Chipset', value: phone.processor?.chipset },
            { label: 'CPU Cores', value: phone.processor?.cpu },
            { label: 'GPU Graphics', value: phone.processor?.gpu }
          ]}
        />

        {/* 5. Memory */}
        <SpecSection
          title="Memory"
          icon={<HardDrive className="w-5 h-5" />}
          items={[
            { label: 'RAM Configurations', value: phone.memory?.ramOptions },
            { label: 'Expandable Card Slot', value: phone.memory?.cardSlot }
          ]}
        />

        {/* 6. Storage */}
        <SpecSection
          title="Storage"
          icon={<Box className="w-5 h-5" />}
          items={[
            { label: 'Storage Capacities', value: phone.storage?.storageOptions }
          ]}
        />

        {/* 7. Camera */}
        <SpecSection
          title="Camera"
          icon={<Camera className="w-5 h-5" />}
          items={[
            { label: 'Rear Camera Modules', value: phone.rearCamera?.modules },
            { label: 'Rear Camera Features', value: phone.rearCamera?.features },
            { label: 'Rear Video Recording', value: phone.rearCamera?.video },
            { label: 'Front Selfie Modules', value: phone.frontCamera?.modules },
            { label: 'Front Camera Features', value: phone.frontCamera?.features },
            { label: 'Front Video Recording', value: phone.frontCamera?.video }
          ]}
        />

        {/* 8. Battery and Charging */}
        <SpecSection
          title="Battery and Charging"
          icon={<Battery className="w-5 h-5" />}
          items={[
            { label: 'Battery Capacity', value: phone.battery?.capacity },
            { label: 'Battery Chemistry', value: phone.battery?.type },
            { label: 'Charging Capabilities', value: phone.charging }
          ]}
        />

        {/* 9. Connectivity */}
        <SpecSection
          title="Connectivity"
          icon={<Wifi className="w-5 h-5" />}
          items={[
            { label: 'WLAN / Wi-Fi', value: phone.connectivity?.wifi },
            { label: 'Bluetooth Version', value: phone.connectivity?.bluetooth },
            { label: 'NFC Support', value: phone.connectivity?.nfc },
            { label: 'USB Interface', value: phone.connectivity?.usb },
            { label: 'Positioning & GPS', value: phone.connectivity?.positioning }
          ]}
        />

        {/* 10. Network */}
        <SpecSection
          title="Network"
          icon={<Radio className="w-5 h-5" />}
          items={[
            { label: 'Technologies', value: phone.network?.technologies },
            { label: 'SIM Support', value: phone.network?.simType }
          ]}
        />

        {/* 11. Physical */}
        <SpecSection
          title="Physical"
          icon={<Box className="w-5 h-5" />}
          items={[
            { label: 'Dimensions (H x W x D)', value: phone.dimensions },
            { label: 'Weight', value: phone.weight }
          ]}
        />
      </div>
    </div>
  );
};
