import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Image } from '@heroui/image'

const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
};

interface Props {
    src: string;
    width: number;
    height: number;
    index: number;
    animationDelay: number;
}

const Skills_Data_Client = ({ src, width, height, index, animationDelay }: Props) => {
    const { ref, inView } = useInView({
        triggerOnce: true, // Chỉ kích hoạt một lần
        threshold: 0.5 // Phần trăm phần tử cần nằm trong tầm nhìn để kích hoạt
    });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            variants={imageVariants}
            animate={inView ? "visible" : "hidden"}
            custom={index}
            transition={{
                delay: index * animationDelay,
                repeat: Infinity,
                repeatType: "reverse",
                duration: 2.5
            }}
        >
            <Image
                src={src}
                width={width}
                height={height}
                alt="skills-logo"
            />
        </motion.div>
    );
};

export default Skills_Data_Client;