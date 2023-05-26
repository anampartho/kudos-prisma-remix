import { LoaderFunction, json } from "@remix-run/node";
import { getOtherUsers, requireUserId } from "~/utils/auth.server";
import { Layout } from "~/components/layout";
import { UserPanel } from "~/components/user-panel";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getFilteredKudos } from "~/utils/kudos.server";
import { Kudo } from "~/components/kudo";
import { Kudo as IKudo, Profile } from "@prisma/client";
import { SearchBar } from "~/components/search-bar";

interface KudoWithProfile extends IKudo {
  author: {
    profile: Profile;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const users = await getOtherUsers(userId);
  const kudos = await getFilteredKudos(userId, {}, {});

  return json({ users, kudos });
};

export default function Home() {
  const { users, kudos } = useLoaderData();

  return (
    <Layout>
      <Outlet />
      <div className="h-full flex">
        <UserPanel users={users} />
        <div className="flex-1 flex flex-col">
          {/* Search Bar Goes Here */}
          <div className="flex-1 flex">
            <SearchBar />

            <div className="w-full p-10 flex flex-col gap-y-4">
              {kudos.map((kudo: KudoWithProfile) => (
                <Kudo key={kudo.id} kudo={kudo} profile={kudo.author.profile} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
