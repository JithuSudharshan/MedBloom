import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { toast } from 'sonner';
import { submitReviewApi } from '../../../api/patientApi';
import Loader from '../../ui/Loading';

export default function ReviewModal({ isOpen, onClose, appointment, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setRating(0);
            setHoveredRating(0);
            setReviewText('');
            setIsSubmitting(false);
        }
    }, [isOpen, appointment]);

    if (!isOpen || !appointment) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            toast.error("Please select a star rating.");
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await submitReviewApi({
                appointmentId: appointment.id,
                rating,
                reviewText
            });

            if (res.data?.success) {
                toast.success("Review submitted successfully!");
                onSuccess();
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden relative"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                        <h2 className="text-xl font-bold text-slate-800">Rate your experience</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="mb-6 text-center">
                            <p className="text-sm text-slate-500 mb-2">How was your consultation with</p>
                            <p className="font-bold text-lg text-slate-800">{appointment.primaryTitle || "Doctor"}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            
                            {/* Star Rating */}
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star 
                                            className={`w-10 h-10 transition-colors ${
                                                (hoveredRating || rating) >= star 
                                                ? 'fill-amber-400 text-amber-400' 
                                                : 'fill-slate-100 text-slate-300'
                                            }`} 
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Review Text */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Share your experience (Optional)
                                </label>
                                <textarea
                                    rows="4"
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="What did you like? What could be improved?"
                                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#00A4A3] focus:ring-4 focus:ring-[#00A4A3]/10 transition-all outline-none resize-none text-slate-700"
                                    maxLength={1000}
                                />
                                <div className="text-right text-xs text-slate-400 mt-1">
                                    {reviewText.length}/1000
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || rating === 0}
                                    className={`flex-1 flex justify-center items-center py-3 px-4 rounded-xl font-bold text-white transition-all ${
                                        isSubmitting || rating === 0
                                        ? 'bg-[#00A4A3]/50 cursor-not-allowed'
                                        : 'bg-[#00A4A3] hover:bg-[#008A89] hover:shadow-lg'
                                    }`}
                                >
                                    {isSubmitting ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Submit Review'}
                                </button>
                            </div>

                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
