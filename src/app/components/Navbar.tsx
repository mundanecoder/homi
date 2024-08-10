import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="dark:bg-black/80  border-b border-gray-850 dark:text-white/80 flex items-center justify-between p-4">
      <div className="text-xl font-bold  flex items-center">homi</div>
      <div className="flex items-center">
        <Link
          href={"/builder-registration"}
          className="px-2 flex border lg:hidden justify-center text-sm rounded py-2 bg-[#151312]"
        >
          login as a builder
        </Link>

        <div className="lg:flex  text-white gap-2  hidden  self-start">
          <Link
            href={"/builder-registration"}
            className="px-2 border flex justify-center text-sm rounded py-2 bg-[#151312]"
          >
            login as a builder
          </Link>
          <Link
            href={"#"}
            className="px-2 border flex justify-center text-sm  rounded py-2 bg-[#151312]"
          >
            login as a user
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
