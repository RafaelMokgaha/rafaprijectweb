
'use client';

import { useState } from 'react';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { placeHolderImages } from '@/lib/placeholder-images';
import { SectionTitle, SectionWrapper } from '@/components/shared/section-layout';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Icons } from '@/components/icons';
import { AuthGate } from '@/app/auth-gate';

// The games to be seeded.
const gamesToSeed = [
    { id: 'gta_v_enhanced', name: 'Grand Theft Auto V ENHANCED' },
    { id: 'rdr2', name: 'Red Dead Redemption 2' },
    { id: 'cyberpunk_2077', name: 'Cyberpunk 2077' },
    { id: 'euro_truck_2', name: 'Euro Truck Simulator 2' },
    { id: 'beamng_drive', name: 'BeamNG.drive' },
];

function SeedPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSeeding, setIsSeeding] = useState(false);

    const handleSeed = async () => {
        if (!firestore) {
            toast({
                title: 'Error',
                description: 'Firestore is not available.',
                variant: 'destructive',
            });
            return;
        }

        setIsSeeding(true);
        try {
            const batch = writeBatch(firestore);
            const gamesCollection = collection(firestore, 'available_games');

            gamesToSeed.forEach(game => {
                const gameImage = placeHolderImages.find(img => img.id === game.id);
                if (gameImage) {
                    const docRef = doc(gamesCollection, game.id);
                    batch.set(docRef, {
                        name: game.name,
                        imageUrl: gameImage.imageUrl,
                    });
                }
            });

            await batch.commit();

            toast({
                title: 'Success!',
                description: `${gamesToSeed.length} games have been added to the database.`,
            });
        } catch (error: any) {
            console.error('Error seeding database:', error);
            toast({
                title: 'Seeding Failed',
                description: error.message || 'An unknown error occurred.',
                variant: 'destructive',
            });
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <>
            <Header>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/admin">Back to Admin</Link>
                </Button>
            </Header>
            <main className="container mx-auto px-4 py-8">
                <SectionWrapper>
                    <SectionTitle>Seed Database</SectionTitle>
                    <div className="text-center max-w-2xl mx-auto">
                        <p className="text-lg text-primary-foreground/80 mb-8">
                            Click the button below to add the initial set of available games to your Firestore database. This only needs to be done once.
                        </p>
                        <Button
                            size="lg"
                            onClick={handleSeed}
                            disabled={isSeeding}
                            className="font-bold tracking-wider uppercase text-lg"
                        >
                            {isSeeding && <Icons.loader className="mr-2 h-5 w-5 animate-spin" />}
                            {isSeeding ? 'Seeding...' : 'Seed Available Games'}
                        </Button>
                    </div>
                </SectionWrapper>
            </main>
        </>
    );
}


export default function SeedDatabasePage() {
    return (
        <AuthGate>
            <SeedPage />
        </AuthGate>
    )
}
