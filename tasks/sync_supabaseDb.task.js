const supabase = require('../conf/supabase');
const { File, ConteudoCurso, TrabalhoSubmetido } = require('../models');

const dependentModels = [
    { model: ConteudoCurso, name: 'ConteudoCurso', foreignKey: 'file' },
    { model: TrabalhoSubmetido, name: 'TrabalhoSubmetido', foreignKey: 'file' }
];

const syncFileDb = async () => {
    console.log('📂 Files Sync started');

    try {
        const { data: supFiles, error } = await supabase.storage.from('pint-files').list('', { limit: 1000 });
        if (error) throw new Error(error.message);

        const dbFiles = await File.findAll({ attributes: ['id', 'name', 'storage_name'] });
        // const dbStorageNames = new Set(dbFiles.map(f => f.storage_name)); // apenas com storage_name
        const dbStorageNames = new Set(dbFiles.map(f => f.storage_name).filter(Boolean)); // apenas com storage_name
        const supNames = new Set(supFiles.map(f => f.name));

        const toRemoveFromStorage = [...supNames].filter(n => !dbStorageNames.has(n));
        if (toRemoveFromStorage.length) {
            await supabase.storage.from('pint-files').remove(toRemoveFromStorage);
            console.log(`🗑️ ${toRemoveFromStorage.length} ficheiros removidos do Supabase.`);
        }

        const missingInStorage = dbFiles.filter(f => f.storage_name && !supNames.has(f.storage_name));
        if (missingInStorage.length) {
            console.log(`\t🔍 A verificar ${missingInStorage.length} ficheiros para possível remoção da BD...`);

            for (const file of missingInStorage) {
                const usedBy = await Promise.all(
                    dependentModels.map(async ({ model, name, foreignKey }) =>
                        (await model.findOne({ where: { [foreignKey]: file.id } })) ? name : null
                    )
                ).then(results => results.filter(Boolean));

                if (usedBy.length) {
                    console.log(`\t\t❌ "${file.name}" — ${usedBy.join(', ')} — não foi apagado.`);
                    continue;
                }

                await File.destroy({ where: { id: file.id } });
                console.log(`\t\t✅ "${file.name}" removido da base de dados.`);
            }
        }

        console.log('📁 Files Sync done');
    } catch (e) {
        console.error('❌ Sync error:', e.message);
    }
};

module.exports = { syncFileDb };
