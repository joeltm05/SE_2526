require('dotenv').config();
const { Inscricao, Utilizador, Curso } = require('../models');

const checkNotf = async (req, res, next) => {
    try {
        const { table, id } = req.params;

        if (!/^[a-z][a-z0-9_]*$/.test(table))
            return res.status(400).json({ error: `Invalid table name: ${table}` });

        const modelName = table.split('_')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join('');

        if (modelName === "Curso") {
            const curso = await Curso.findOne({ where: { id }, raw: true });
            if (!curso) return res.status(404).json({ error: "Curso not found" });

            const inscricoes = await Inscricao.findAll({
                attributes: ['formando'],
                where: { curso: id },
                raw: true
            });

            const diff = {};
            for (const key in req.body)
                if (curso[key] !== req.body[key])
                    diff[key] = { old: curso[key], new: req.body[key] };

            if (Object.keys(diff).length > 0)
                for (const f of inscricoes) {
                    const user = await Utilizador.findOne({ where: { id: f.formando }, raw: true });
                    if (!user) continue;
                    const _title = `Curso ${curso.nome} atualizado`;

                    const formatDate = (date) => {
                        if (!date) return '-';
                        const d = new Date(date);
                        return d.toISOString().split('T')[0];
                    };

                    try {
                        const mailRes = await fetch(`${process.env.URL}auth/mail`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                to: user.email,
                                subject: _title,
                                html: `<!DOCTYPE html>
                                    <html lang="pt">
                                    <head>
                                    <meta charset="UTF-8">
                                    <title>Curso Atualizado</title>
                                    </head>
                                    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin:0; padding:20px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 0 10px rgba(0,0,0,0.1);">
                                        <tr>
                                        <td style="background-color:#2c3e50; padding:20px; color:#ffffff; text-align:center;">
                                            <h1 style="margin:0; font-size:24px;">📘 Curso Atualizado</h1>
                                            <p style="margin:5px 0 0;">${curso.nome}</p>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td style="padding:20px;">
                                            <p>Olá ${user.username},</p>
                                            <p>O curso que estás inscrito sofreu as seguintes atualizações:</p>
                                            <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse;">
                                            <thead>
                                                <tr style="background-color:#ecf0f1; text-align:left;">
                                                <th>Campo</th>
                                                <th>Anterior</th>
                                                <th>Novo</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${Object.entries(diff).map(([k, v]) => {
                                    let oldVal = v.old;
                                    let newVal = v.new;
                                    if (k.includes('dia') || k.includes('atualizacao')) {
                                        oldVal = formatDate(v.old);
                                        newVal = formatDate(v.new);
                                    }
                                    return `
                                                    <tr>
                                                    <td style="border-bottom:1px solid #ddd;">${k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</td>
                                                    <td style="border-bottom:1px solid #ddd; color:#7f8c8d;">${oldVal}</td>
                                                    <td style="border-bottom:1px solid #ddd; color:#27ae60; font-weight:bold;">${newVal}</td>
                                                    </tr>
                                                `;
                                }).join('')}
                                            </tbody>
                                            </table>
                                            <p style="font-size:12px; color:#999;">Este é um email automático. Última atualização: ${formatDate(new Date())}</p>
                                        </td>
                                        </tr>
                                    </table>
                                    </body>
                                    </html>
                                    `
                            })
                        });

                        const contentType = mailRes.headers.get('content-type') || '';
                        let mailData = await (contentType.includes('application/json') ? mailRes.json() : mailRes.text());

                        console.log(`📧 Mail to ${user.email}:`, mailData);
                    } catch (err) {
                        console.error(`❌ Failed to send mail to ${user.email}:`, err);
                    }
                    const _formatDate = (val) => {
                        const d = new Date(val);
                        return isNaN(d) ? val : d.toLocaleDateString("pt-PT");
                    };

                    const prettifyKey = (key) => {
                        switch (key) {
                            case "nome": return "Nome";
                            case "dia_inicio": return "Data de início";
                            case "dia_fim": return "Data de fim";
                            case "descricao": return "Descrição";
                            default:
                                // transforma snake_case → "Snake case"
                                return key.replace(/_/g, " ")
                                    .replace(/^\w/, c => c.toUpperCase());
                        }
                    };
                    try {
                        const notifRes = await fetch(`${process.env.URL}auth/notify`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                _user: user.id,
                                _title,
                                _body: Object.entries(diff)
                                    .map(([k, v]) => `- ${prettifyKey(k)}: ${_formatDate(v.old)} ➝ ${_formatDate(v.new)}`)
                                    .join("\n")
                            })
                        });

                        let notifData = await ((notifRes.headers.get('content-type') || '').includes('application/json') ? notifRes.json() : notifRes.text());

                        console.log(`🔔 Notification to ${user.username}:`, notifData);
                    } catch (err) {
                        console.error(`❌ Failed to send notification to ${user.username}:`, err);
                    }

                }
        } else if (modelName === "Inscricao") {
            const inscricao = await Inscricao.findOne({ where: { id }, raw: true });
            if (!inscricao) return res.status(404).json({ error: "Inscricao not found" });
            const user = await Utilizador.findByPk(inscricao.formando);
            if (!user) return res.status(400).json({ error: "User not found!" });

            const title = `Inscrição Concluída!`;

            try {
                const mailRes = await fetch(`${process.env.URL}auth/mail`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: user.email,
                        subject: title,
                        html: `<!DOCTYPE html>
                            <html lang="pt">
                            <head>
                            <meta charset="UTF-8">
                            <title>Inscrição Concluída</title>
                            </head>
                            <body style="font-family: Arial, sans-serif; background-color: #f0f2f5; margin:0; padding:20px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
                                <tr>
                                <td style="background-color:#27ae60; padding:25px; color:#ffffff; text-align:center;">
                                    <h1 style="margin:0; font-size:26px;">🎉 Inscrição Concluída!</h1>
                                </td>
                                </tr>
                                <tr>
                                <td style="padding:25px;">
                                    <p>Olá <strong>${user.username}</strong>,</p>
                                    <p>Parabéns! A tua inscrição no curso "<strong>${curso.nome}</strong>" foi concluída com sucesso.</p>
                                    <p>Fica atento(a) a futuras notificações sobre alterações no curso, como mudanças de formador, datas ou conteúdos.</p>
                                    <p>Aproveita e prepara-te para aprender! 📘✨</p>
                                    <p style="font-size:12px; color:#999; text-align:center;">Este é um email automático. Por favor, não responda a esta mensagem.</p>
                                </td>
                                </tr>
                            </table>
                            </body>
                            </html>`
                    })
                });

                const contentType = mailRes.headers.get('content-type') || '';
                let mailData = await contentType.includes('application/json') ? mailRes.json() : mailRes.text();

                console.log(`📧 Mail to ${user.email}:`, mailData);
            } catch (err) {
                console.error(`❌ Failed to send mail to ${user.email}:`, err);
            }
            try {
                const notifRes = await fetch(`${process.env.URL}auth/notify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        _user: user.id,
                        title,
                        _body: `Olá ${user.username},\n\nParabéns! A tua inscrição no curso ${inscricao.nomeCurso} foi concluída com sucesso!\n\nFica atento(a) a futuras notificações sobre alterações no curso, como mudanças de formador, datas ou conteúdos.📘✨`
                    })
                });

                let notifData = await (notifRes.headers.get('content-type') || '').includes('application/json') ? notifRes.json() : notifRes.text();

                console.log(`🔔 Notification to ${user.username}:`, notifData);
            } catch (err) {
                console.error(`❌ Failed to send notification to ${user.username}:`, err);
            }
        }
        next();
    } catch (err) {
        console.error("checkNotf error:", err);
        next(err);
    }
};

module.exports = {
    checkNotf
};
