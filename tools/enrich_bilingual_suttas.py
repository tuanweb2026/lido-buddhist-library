#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enrich kinh_sach_catalog.json and kinh_sach_data.js with full English translations
(title_en, pali_title_en, category_name_en, translator_en, reading_time_en, summary_en, content_html_en, pages_data_en)
"""

import json
import os

CATALOG_PATH = "/Users/abc/Documents/LIDO AI SOFTWARE FACTORY/demo_website_buddhist_library/data/kinh_sach_catalog.json"
DATA_JS_PATH = "/Users/abc/Documents/LIDO AI SOFTWARE FACTORY/demo_website_buddhist_library/data/kinh_sach_data.js"

with open(CATALOG_PATH, "r", encoding="utf-8") as f:
    catalog = json.load(f)

# Comprehensive English translations dictionary for all 20 items
EN_DATA = {
    "kinh-trung-bo-kinh-niem-xu": {
        "title_en": "Satipaṭṭhāna Sutta — The Foundations of Mindfulness",
        "pali_title_en": "Majjhima Nikāya 10 (MN 10)",
        "category_name_en": "Middle Length Discourses (Majjhima Nikāya)",
        "translator_en": "Bhikkhu Bodhi & Bhikkhu Sujato",
        "reading_time_en": "27 min read",
        "summary_en": "The direct and only path for the purification of beings, for the overcoming of sorrow and lamentation, for the ending of physical and mental suffering, for the attainment of true wisdom, and for the realization of Nibbāna — namely, the Four Foundations of Mindfulness: Contemplation of Body, Feelings, Mind, and Mind-Objects (Dhammas).",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead"><strong>Thus have I heard.</strong> At one time the Blessed One was living in the Kuru country at a town of the Kurus named Kammāsadhamma.</p>
<p>There the Blessed One addressed the bhikkhus: “Bhikkhus.” — “Venerable sir,” they replied. The Blessed One said this:</p>
<blockquote class="sutta-quote">
“Bhikkhus, this is the direct path for the purification of beings, for the surmounting of sorrow and lamentation, for the disappearance of pain and grief, for the attainment of the true method, for the realization of Nibbāna — namely, the four foundations of mindfulness (Cattāro Satipaṭṭhānā).”
</blockquote>
<p>“What are the four? Here, bhikkhus, a bhikkhu abides contemplating the body as a body, ardent, clearly comprehending, and mindful, having put away covetousness and grief regarding the world. He abides contemplating feelings as feelings, ardent, clearly comprehending, and mindful, having put away covetousness and grief regarding the world. He abides contemplating mind as mind, ardent, clearly comprehending, and mindful, having put away covetousness and grief regarding the world. He abides contemplating mind-objects as mind-objects, ardent, clearly comprehending, and mindful, having put away covetousness and grief regarding the world.”</p>

<h3 class="reader-subheading">I. Contemplation of the Body (Kāyānupassanā)</h3>
<h4 class="reader-minor-heading">1. Mindfulness of Breathing (Ānāpānasati)</h4>
<p>“And how, bhikkhus, does a bhikkhu abide contemplating the body as a body? Here a bhikkhu, gone to the forest or to the root of a tree or to an empty hut, sits down; having folded his legs crosswise, set his body erect, and established mindfulness in front of him, mindful he breathes in, mindful he breathes out.”</p>
<ul>
  <li>Breathing in long, he discerns: ‘I breathe in long’; or breathing out long, he discerns: ‘I breathe out long.’</li>
  <li>Breathing in short, he discerns: ‘I breathe in short’; or breathing out short, he discerns: ‘I breathe out short.’</li>
  <li>He trains thus: ‘Experiencing the whole body, I shall breathe in’; he trains thus: ‘Experiencing the whole body, I shall breathe out.’</li>
  <li>He trains thus: ‘Calming the bodily formation, I shall breathe in’; he trains thus: ‘Calming the bodily formation, I shall breathe out.’</li>
</ul>
<p>“Just as a skilled turner or his apprentice, when making a long turn, understands: ‘I make a long turn’; or when making a short turn, understands: ‘I make a short turn’; so too a bhikkhu trains thus... In this way he abides contemplating the body as a body internally, or externally, or both internally and externally. He abides contemplating in the body its arising factors, or its vanishing factors, or both its arising and vanishing factors. Or mindfulness that ‘there is a body’ is simply established in him to the extent necessary for bare knowledge and continuous mindfulness. And he abides independent, not clinging to anything in the world.”</p>

<h4 class="reader-minor-heading">2. The Four Postures & Clear Comprehension (Sampajañña)</h4>
<p>“Again, bhikkhus, when walking, a bhikkhu understands: ‘I am walking’; when standing, he understands: ‘I am standing’; when sitting, he understands: ‘I am sitting’; when lying down, he understands: ‘I am lying down.’ In whatever way his body is disposed, that is how he understands it.”</p>
<p>“Again, a bhikkhu is one who acts in full awareness when going forward and returning; when looking ahead and looking away; when flexing and extending his limbs; when wearing his robes and carrying his outer robe and bowl; when eating, drinking, chewing, and savoring; when defecating and urinating; when walking, standing, sitting, falling asleep, waking up, talking, and keeping silent.”</p>

<h4 class="reader-minor-heading">3. The 32 Parts of the Body & The Four Great Elements</h4>
<p>“Again, bhikkhus, a bhikkhu reflects on this very body from the soles of the feet up and from the crown of the head down, bounded by skin and full of many kinds of impurities: ‘In this body there are head-hairs, body-hairs, nails, teeth, skin, flesh, sinews, bones, bone-marrow, kidneys, heart, liver, diaphragm, spleen, lungs, large intestines, small intestines, contents of the stomach, feces, bile, phlegm, pus, blood, sweat, fat, tears, grease, spit, snot, oil of the joints, and urine.’ Just as though there were a bag with an opening at both ends full of many kinds of grain... so too a bhikkhu reflects upon this body.”</p>
<p>“Again, a bhikkhu reflects on this very body as it stands and is disposed in terms of the elements: ‘In this body there is the earth element, the water element, the fire element, and the air element.’”</p>

<h4 class="reader-minor-heading">4. The Nine Charnel Ground Contemplations</h4>
<p>“Again, bhikkhus, as if he were to see a corpse cast away in a charnel ground, one, two, or three days dead, bloated, livid, and oozing matter, a bhikkhu applies this to his own body thus: ‘This body too is of the same nature, it will be like that, it is not exempt from that fate.’”</p>

<h3 class="reader-subheading">II. Contemplation of Feelings (Vedanānupassanā)</h3>
<p>“And how, bhikkhus, does a bhikkhu abide contemplating feelings as feelings? Here, when feeling a pleasant feeling, a bhikkhu understands: ‘I feel a pleasant feeling’; when feeling a painful feeling, he understands: ‘I feel a painful feeling’; when feeling a neither-painful-nor-pleasant feeling, he understands: ‘I feel a neither-painful-nor-pleasant feeling.’”</p>
<p>“When feeling a worldly or unworldly pleasant feeling, a worldly or unworldly painful feeling, or a worldly or unworldly neutral feeling, he discerns it as it actually is. He abides contemplating feelings internally, externally, or both, observing their arising and passing away, free from craving and clinging.”</p>

<h3 class="reader-subheading">III. Contemplation of Mind (Cittānupassanā)</h3>
<p>“And how, bhikkhus, does a bhikkhu abide contemplating mind as mind? Here a bhikkhu understands mind affected by lust as lustful, and mind unaffected by lust as unlustful. He understands mind affected by hate as hateful, and mind unaffected by hate as unhateful. He understands mind affected by delusion as deluded, and mind unaffected by delusion as undeluded.”</p>
<p>“He understands contracted mind as contracted, and distracted mind as distracted. He understands exalted mind as exalted, and unexalted mind as unexalted. He understands surpassed mind as surpassed, and unsurpassed mind as unsurpassed. He understands concentrated mind as concentrated, and unconcentrated mind as unconcentrated. He understands liberated mind as liberated, and unliberated mind as unliberated.”</p>

<h3 class="reader-subheading">IV. Contemplation of Mind-Objects (Dhammānupassanā)</h3>
<p>“And how, bhikkhus, does a bhikkhu abide contemplating mind-objects as mind-objects?”</p>
<ul>
  <li><strong>The Five Hindrances (Nīvaraṇa):</strong> Sensual desire, ill will, sloth and torpor, restlessness and remorse, and skeptical doubt. He discerns their presence, absence, arising, and abandonment.</li>
  <li><strong>The Five Clinging-Aggregates (Upādānakkhandha):</strong> Form, feeling, perception, volitional formations, and consciousness. He discerns: ‘Such is form, such its arising, such its disappearance...’</li>
  <li><strong>The Six Internal and External Sense Bases (Āyatana):</strong> Eye and forms, ear and sounds, nose and odors, tongue and flavors, body and tangibles, mind and mental phenomena; and the fetter that arises dependent on both.</li>
  <li><strong>The Seven Factors of Awakening (Bojjhaṅga):</strong> Mindfulness, investigation-of-states, energy, rapture, tranquility, concentration, and equanimity.</li>
  <li><strong>The Four Noble Truths (Ariyasacca):</strong> He understands as it actually is: ‘This is suffering; this is the origin of suffering; this is the cessation of suffering; this is the way leading to the cessation of suffering.’</li>
</ul>

<h3 class="reader-subheading">Conclusion: The Assurance of Awakening</h3>
<p>“Bhikkhus, if anyone should develop these four foundations of mindfulness in this way for seven years... or even for seven months, or seven days, one of two fruits may be expected for him: either final knowledge (arahantship) here and now, or if there is a trace of clinging left, non-returning.”</p>
<p>“It was for this reason that it was said: ‘Bhikkhus, this is the direct path for the purification of beings, for the surmounting of sorrow and lamentation, for the disappearance of pain and grief, for the attainment of the true method, for the realization of Nibbāna — namely, the four foundations of mindfulness.’”</p>
<p>That is what the Blessed One said. The bhikkhus were satisfied and delighted in the Blessed One’s words.</p>
</div>"""
    },
    "kinh-trung-bo-kinh-phap-mon-can-ban": {
        "title_en": "Mūlapariyāya Sutta — The Root of All Things",
        "pali_title_en": "Majjhima Nikāya 1 (MN 1)",
        "category_name_en": "Middle Length Discourses (Majjhima Nikāya)",
        "translator_en": "Bhikkhu Bodhi",
        "reading_time_en": "18 min read",
        "summary_en": "The seminal first discourse of the Majjhima Nikāya exploring the profound mechanics of human consciousness and cognitive grasping: from the ordinary untaught worldling who conceives and delights in 'earth, water, fire, air, beings, gods, Nibbāna', to the trainee, the Arahat, and the Buddha who perceive phenomena directly without grasping or identification.",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead"><strong>Thus have I heard.</strong> At one time the Blessed One was living in Ukkaṭṭhā in the Subhaga Grove at the root of a royal sal tree.</p>
<p>There the Blessed One addressed the bhikkhus: “Bhikkhus.” — “Venerable sir,” they replied. The Blessed One said this: “Bhikkhus, I shall teach you the discourse on the root of all things. Listen and attend closely to what I shall say.” — “Yes, venerable sir,” the bhikkhus replied. The Blessed One said this:</p>

<h3 class="reader-subheading">I. The Untaught Worldling (Puthujjana)</h3>
<p>“Here, bhikkhus, an untaught ordinary person, who has no regard for noble ones and is unskilled and undisciplined in their Dhamma, who has no regard for true men and is unskilled and undisciplined in their Dhamma: perceives earth as earth. Having perceived earth as earth, he conceives himself as earth, he conceives himself in earth, he conceives himself apart from earth, he conceives earth to be ‘mine’, he delights in earth. Why is that? Because he has not fully understood it, I say.”</p>
<p>“He perceives water as water... fire as fire... air as air... beings as beings... devas as devas... Pajāpati as Pajāpati... Brahmā as Brahmā... the radiant gods... the gods of abundant fruit... the Unconquered... the base of infinite space... the base of infinite consciousness... the base of nothingness... the base of neither-perception-nor-non-perception... the seen... the heard... the sensed... the cognized... unity... diversity... the all... Nibbāna as Nibbāna. Having perceived Nibbāna as Nibbāna, he conceives himself as Nibbāna, he conceives himself in Nibbāna, he conceives himself apart from Nibbāna, he conceives Nibbāna to be ‘mine’, he delights in Nibbāna. Why is that? Because he has not fully understood it, I say.”</p>

<h3 class="reader-subheading">II. The Disciple in Higher Training (Sekha)</h3>
<p>“Bhikkhus, a bhikkhu who is in higher training, whose mind has not yet reached the goal, and who is still aspiring to supreme security from bondage: he directly knows earth as earth. Having directly known earth as earth, let him not conceive himself as earth, let him not conceive himself in earth, let him not conceive himself apart from earth, let him not conceive earth to be ‘mine’, let him not delight in earth. Why is that? So that he may fully understand it, I say.”</p>

<h3 class="reader-subheading">III. The Arahant (Khīṇāsava)</h3>
<p>“Bhikkhus, a bhikkhu who is an arahant, one whose taints are destroyed, who has lived the holy life, done what had to be done, laid down the burden, reached his own true goal, destroyed the fetters of existence, and is completely liberated through final knowledge: he directly knows earth as earth... through to Nibbāna as Nibbāna. Having directly known it, he does not conceive himself as it, nor in it, nor apart from it, nor does he think ‘it is mine’, nor does he delight in it. Why is that? Because he has fully understood it, because he is free from lust, free from hatred, free from delusion through the destruction of defilement.”</p>

<h3 class="reader-subheading">IV. The Tathāgata, The Fully Enlightened One</h3>
<p>“Bhikkhus, the Tathāgata, accomplished and fully enlightened, directly knows earth as earth... up to Nibbāna as Nibbāna. Having directly known it, he does not conceive himself as it, nor in it, nor apart from it, nor does he think ‘it is mine’, nor does he delight in it. Why is that? Because the Tathāgata has understood that delight is the root of suffering, and that with being as condition there is birth, and that for whatever has come to be there is aging and death. Therefore, through the complete destruction, fading away, cessation, giving up, and relinquishment of cravings, the Tathāgata has awakened to supreme full enlightenment.”</p>
<p>That is what the Blessed One said. But the bhikkhus did not delight in the Blessed One’s words.</p>
</div>"""
    },
    "kinh-trung-bo-kinh-tat-ca-lau-hoac": {
        "title_en": "Sabbāsava Sutta — All the Taints (Fermentations)",
        "pali_title_en": "Majjhima Nikāya 2 (MN 2)",
        "category_name_en": "Middle Length Discourses (Majjhima Nikāya)",
        "translator_en": "Bhikkhu Bodhi",
        "reading_time_en": "16 min read",
        "summary_en": "A master discourse detailing seven distinct, practical psychological methods for overcoming and abandoning all taints (āsavas): by seeing (wise reflection), by restraining (sense faculties), by using (requisites), by enduring (hardships and climate), by avoiding (dangers), by removing (unwholesome thoughts), and by developing (the seven factors of enlightenment).",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead"><strong>Thus have I heard.</strong> At one time the Blessed One was living at Sāvatthī in Jeta’s Grove, Anāthapiṇḍika’s Park.</p>
<p>There the Blessed One addressed the bhikkhus: “Bhikkhus.” — “Venerable sir,” they replied. The Blessed One said this: “Bhikkhus, I shall teach you the discourse on the restraint of all the taints (āsavas). Listen and attend closely to what I shall say.” — “Yes, venerable sir,” the bhikkhus replied. The Blessed One said this:</p>
<blockquote class="sutta-quote">
“Bhikkhus, I say that the destruction of the taints is for one who knows and sees, not for one who does not know and does not see. For one who knows and sees what? Wise attention (yoniso manasikāra) and unwise attention (ayoniso manasikāra).”
</blockquote>

<h3 class="reader-subheading">The Seven Practical Methods of Restraint</h3>
<ol>
  <li><strong>Taints to be abandoned by Seeing (Dassanā):</strong> By reflecting wisely on the Four Noble Truths instead of entertaining useless metaphysical doubts (‘Was I in the past? What was I? Shall I be in the future? Do I exist? Does the soul exist?’). By attending wisely, the first three fetters (personality view, doubt, adherence to rules and rites) are abandoned.</li>
  <li><strong>Taints to be abandoned by Restraining (Saṁvarā):</strong> When seeing a form with the eye, hearing a sound with the ear, smelling an odor with the nose, tasting a flavor with the tongue, touching a tangible with the body, or cognizing a mental state with the mind — he guards the sense doors, not grasping at signs or secondary characteristics that could allow unwholesome states to invade the heart.</li>
  <li><strong>Taints to be abandoned by Using (Paṭisevanā):</strong> Reflecting wisely, he uses robes only for protection from cold, heat, and insect bites, and for modesty; he uses almsfood not for amusement or vanity, but solely for bodily sustenance to live the holy life; he uses lodging for shelter; and he uses medicine only to dispel pain and preserve health.</li>
  <li><strong>Taints to be abandoned by Enduring (Adhivāsanā):</strong> Reflecting wisely, he endures cold and heat, hunger and thirst, contact with horseflies and mosquitoes, wind and sun, verbally abusive words, and bodily pains that are sharp, searing, and life-threatening.</li>
  <li><strong>Taints to be abandoned by Avoiding (Parivajjanā):</strong> Reflecting wisely, he avoids wild beasts, dangerous roads, swamps, precipices, and associating with companions who encourage unwholesome deeds.</li>
  <li><strong>Taints to be abandoned by Removing (Vinodanā):</strong> Reflecting wisely, he does not tolerate an arisen sensual thought, thought of ill will, or thought of cruelty; he abandons it, removes it, dispels it, and wipes it out of existence.</li>
  <li><strong>Taints to be abandoned by Developing (Bhāvanā):</strong> Reflecting wisely, he develops the enlightenment factor of mindfulness, investigation-of-states, energy, rapture, tranquility, concentration, and equanimity, based on seclusion, dispassion, and cessation, maturing in release.</li>
</ol>
<p>“When a bhikkhu has abandoned the taints through these seven methods, he is called a bhikkhu who has severed craving, flung off the fetters, and by fully understanding conceit, has made an end of suffering.”</p>
<p>That is what the Blessed One said. The bhikkhus were delighted in the Blessed One’s words.</p>
</div>"""
    },
    "kinh-trung-bo-kinh-thua-tu-phap": {
        "title_en": "Dhammadāyāda Sutta — Heirs in Dhamma",
        "pali_title_en": "Majjhima Nikāya 3 (MN 3)",
        "category_name_en": "Middle Length Discourses (Majjhima Nikāya)",
        "translator_en": "Bhikkhu Bodhi",
        "reading_time_en": "14 min read",
        "summary_en": "The Buddha issues an urgent admonition to all practitioners: 'Be heirs in Dhamma, bhikkhus, not heirs in material things.' Venerable Sāriputta continues by detailing the noble discipline of seclusion and how to cultivate the Middle Way abandoning greed, resentment, arrogance, and hypocrisy.",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead"><strong>Thus have I heard.</strong> At one time the Blessed One was living at Sāvatthī in Jeta’s Grove, Anāthapiṇḍika’s Park.</p>
<p>There the Blessed One addressed the bhikkhus: “Bhikkhus.” — “Venerable sir,” they replied. The Blessed One said this:</p>
<blockquote class="sutta-quote">
“Bhikkhus, be my heirs in Dhamma, not my heirs in material things (Dhammadāyādā me, bhikkhave, bhavatha, mā āmisadāyādā). Out of compassion for you I have thought: ‘How may my disciples be heirs in Dhamma, not heirs in material things?’”
</blockquote>
<p>“If you should be my heirs in material things, both you and I would be criticized: ‘The Master’s disciples live as heirs in material things, not as heirs in Dhamma.’ But if you are heirs in Dhamma, not heirs in material things, both you and I will be praised.”</p>

<h3 class="reader-subheading">Venerable Sāriputta’s Elaboration</h3>
<p>When the Buddha retired to his dwelling, Venerable Sāriputta addressed the assembly: “In what way do disciples of the Master not train in seclusion when the Master lives in seclusion? And in what way do they train in seclusion when the Master lives in seclusion?”</p>
<ul>
  <li><strong>Failing to train in seclusion:</strong> When disciples do not abandon the things the Master has told them to abandon, when they live in luxury, laxity, foremost in backsliding, neglecting seclusion.</li>
  <li><strong>Training in true seclusion:</strong> When disciples diligently abandon what the Master has instructed them to abandon; they are not luxurious or lax, but lead the way in letting go and dwell dedicated to physical, mental, and spiritual seclusion.</li>
</ul>

<h3 class="reader-subheading">The Middle Way of Insight</h3>
<p>“Greed is an evil state, and hate is an evil state. To abandon greed and hate there is the Middle Way: it produces vision, produces knowledge, and leads to peace, to direct knowledge, to awakening, to Nibbāna. And what is that Middle Way? It is this Noble Eightfold Path: Right View, Right Intention, Right Speech, Right Action, Right Livelihood, Right Effort, Right Mindfulness, and Right Concentration.”</p>
<p>“Likewise, anger and hostility, denigration and insolence, envy and jealousy, deceit and fraud, obstinacy and presumption, arrogance and conceit, pride and negligence — for the abandoning of all these evil unwholesome states there is this same Noble Eightfold Path.”</p>
<p>Thus spoke Venerable Sāriputta. The bhikkhus were inspired and delighted in his explanation.</p>
</div>"""
    },
    "kinh-trung-bo-kinh-so-hai-va-khiep-dam": {
        "title_en": "Bhayabherava Sutta — Fear and Dread",
        "pali_title_en": "Majjhima Nikāya 4 (MN 4)",
        "category_name_en": "Middle Length Discourses (Majjhima Nikāya)",
        "translator_en": "Bhikkhu Bodhi",
        "reading_time_en": "20 min read",
        "summary_en": "To the Brahmin Jāṇussoṇi, the Buddha vividly narrates his solitary struggles prior to enlightenment in the lonely forest groves. He reveals the sixteen inner impurities that give rise to fear and explains how he subdued terror directly in that very posture, culminating in the attainment of the Four Jhānas and the Three Knowledges of Awakening.",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead"><strong>Thus have I heard.</strong> At one time the Blessed One was living at Sāvatthī in Jeta’s Grove, Anāthapiṇḍika’s Park.</p>
<p>The brahmin Jāṇussoṇi approached the Blessed One and said: “Master Gotama, it is hard to dwell in remote jungle thickets. Seclusion is arduous to endure, solitude is difficult to enjoy, and the forest groves must shatter the mind of a monk who has not attained concentration.”</p>
<p>The Blessed One replied: “So it is, brahmin! Before my enlightenment, when I was still an unawakened Bodhisatta, I too considered: ‘Remote jungle sanctuaries are hard to endure...’ But I considered thus:”</p>

<h3 class="reader-subheading">The Sixteen Causes of Fear and Dread</h3>
<p>“Brahmin, those recluses or brahmins who resort to remote forest dwellings with bodily conduct unpurified, verbal conduct unpurified, mental conduct unpurified, livelihood unpurified; those who are covetous, full of ill will, overcome by sloth and torpor, restless and unpeaceful, filled with doubt and hesitation; those who praise themselves and disparage others, who are fearful and timid, who desire gain, honor, and fame; who are lazy and lacking energy, muddle-minded and unmindful, unconcentrated, or lacking wisdom — it is because of these blemishes that fear and dread arise in them.”</p>
<p>“I examined myself: ‘I resort to remote forest dwellings with body, speech, and mind thoroughly purified, free from covetousness, with loving-kindness in heart, energetic, mindful, concentrated, and wise.’ Seeing this purity within myself, I dwelt in the forest with absolute fearlessness.”</p>

<h3 class="reader-subheading">Confronting Terror Directly</h3>
<p>“Brahmin, while I was staying in horrifying wilderness groves on auspicious nights (the fourteenth, fifteenth, and eighth of the fortnight), an animal would approach, a peacock would snap a twig, or the wind would rustle fallen leaves. I thought: ‘What if that fear and dread were to come?’ Then I thought: ‘Why do I dwell waiting for fear? Let me subdue that fear and dread right in whatever posture it finds me!’”</p>
<p>“If fear and dread came upon me while walking, I would neither stand nor sit nor lie down until I had subdued it while walking. If it came while standing, I would not sit or lie down until I had subdued it while standing. If it came while sitting, I would not lie down until I had subdued it while sitting. If it came while lying down, I would remain lying down until I had subdued it in that very posture!”</p>

<h3 class="reader-subheading">Attainment of the Three True Knowledges (Tevijjā)</h3>
<p>“With tireless energy aroused, unclouded mindfulness established, body calmed, and mind concentrated, I entered upon and abided in the first jhāna... the second jhāna... the third jhāna... and the fourth jhāna.”</p>
<ul>
  <li><strong>First Knowledge (First Watch of the Night):</strong> Recollection of past lives (Pubbenivāsānussatiñāṇa) — remembering thousands of births, names, clans, and experiences.</li>
  <li><strong>Second Knowledge (Middle Watch of the Night):</strong> The Divine Eye (Dibbacakkhu) — seeing beings passing away and reappearing according to their kamma (good and bad deeds).</li>
  <li><strong>Third Knowledge (Last Watch of the Night):</strong> Destruction of the Taints (Āsavakkhayañāṇa) — directly knowing suffering, its origin, its cessation, and the way leading to its cessation. My mind was liberated from the taints of sensual desire, being, and ignorance. Knowledge arose: ‘Birth is ended, the holy life fulfilled, done is what had to be done, there is no more coming back to this state.’</li>
</ul>
<p>The brahmin Jāṇussoṇi, deeply moved, praised the Buddha and took refuge as a lay disciple for life.</p>
</div>"""
    },
    "kinh-trung-bo-kinh-doan-giam": {
        "title_en": "Sallekha Sutta — Effacement",
        "pali_title_en": "Majjhima Nikāya 8 (MN 8)",
        "category_name_en": "Middle Length Discourses (Majjhima Nikāya)",
        "translator_en": "Bhikkhu Bodhi",
        "reading_time_en": "18 min read",
        "summary_en": "Venerable Mahā Cunda questions the Buddha on the effacement of self-views and defilements. The Buddha explains that meditative absorptions alone do not constitute true effacement, but rather active ethical restraint through forty-four explicit practical principles of purification.",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead"><strong>Thus have I heard.</strong> At one time the Blessed One was living at Sāvatthī in Jeta’s Grove, Anāthapiṇḍika’s Park.</p>
<p>Venerable Mahā Cunda approached the Blessed One, bowed, sat down, and asked: “Venerable sir, there are various views that arise in the world concerning the self and the world. How does a bhikkhu abandon and relinquish these views at the very beginning of his practice?”</p>
<p>The Blessed One replied: “Cunda, as to those diverse views: when a bhikkhu sees with proper wisdom as it really is: ‘This is not mine, this I am not, this is not my self,’ then abandoning and relinquishing of those views occurs.”</p>

<h3 class="reader-subheading">Distinction Between Pleasant Abidings and Effacement</h3>
<p>“Now, Cunda, a bhikkhu secluded from sensual pleasures enters upon and abides in the first, second, third, or fourth jhāna, or the formless attainments. He might think: ‘I am practicing effacement (sallekha).’ But in the Noble Discipline, these are not called ‘effacement’; they are called ‘pleasant abidings in the present life’ (diṭṭhadhammasukhavihāra).”</p>

<h3 class="reader-subheading">The 44 Principles of True Effacement</h3>
<p>“Here, Cunda, effacement should be practiced thus by you:”</p>
<ol>
  <li>‘Others may be harmful; we shall be harmless here’: thus effacement should be practiced.</li>
  <li>‘Others may kill living beings; we shall abstain from killing living beings.’</li>
  <li>‘Others may take what is not given; we shall abstain from taking what is not given.’</li>
  <li>‘Others may be unchaste; we shall be chaste.’</li>
  <li>‘Others may speak falsehood; we shall speak the truth.’</li>
  <li>‘Others may speak maliciously; we shall abstain from malicious speech.’</li>
  <li>‘Others may speak harshly; we shall speak gentle, loving words.’</li>
  <li>‘Others may chatter frivolously; we shall speak at the proper time with reason.’</li>
  <li>‘Others may be covetous; we shall be uncovetous.’</li>
  <li>‘Others may have ill will; we shall have a mind of loving-kindness.’</li>
  <li>‘Others may hold wrong view; we shall possess right view.’</li>
  <li>‘Others may be angry; we shall not be angry.’</li>
  <li>‘Others may be resentful; we shall be unresentful.’</li>
  <li>‘Others may be arrogant, envious, stingy, deceitful, shameless, or heedless; we shall be humble, generous, modest, mindful, and energetic.’</li>
  <li>‘Others may adhere stubbornly to their own views; we shall not adhere to our own views and shall let go easily.’</li>
</ol>

<h3 class="reader-subheading">The Parable of the Drowning Man</h3>
<blockquote class="sutta-quote">
“Cunda, that one who is himself sinking in the mud should pull out another who is sinking in the mud — that is impossible. But that one who is not sinking in the mud should pull out another who is sinking in the mud — that is possible.”
</blockquote>
<p>“So too, one who is himself untamed, undisciplined, and unextinguished cannot tame, discipline, and extinguish others. But one who is tamed, disciplined, and extinguished can help others become tamed, disciplined, and extinguished.”</p>
<p>“What should be done out of compassion by a Master for his disciples has been done by me for you. Here are roots of trees, here are empty huts. Meditate, Cunda, do not delay, lest you regret it later. This is our instruction to you.”</p>
</div>"""
    },
    "ba-muoi-bay-pham-tro-dao": {
        "title_en": "The Thirty-Seven Requisites of Enlightenment (Bodhipakkhiyā Dhammā)",
        "pali_title_en": "Comprehensive Theravāda Treatise",
        "category_name_en": "Theravāda Core Treatises",
        "translator_en": "Ven. Thích Thông Lạc — English Monastic Edition",
        "reading_time_en": "45 min read",
        "summary_en": "A profound, systematic study of the thirty-seven factors leading to Awakening (Bodhipakkhiyā Dhammā) — the foundational curriculum of practical Buddhist training: the 4 Foundations of Mindfulness, 4 Right Efforts, 4 Bases of Success, 5 Faculties, 5 Powers, 7 Awakening Factors, and the Noble Eightfold Path.",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead">The <strong>Thirty-Seven Requisites of Enlightenment (Bodhipakkhiyā Dhammā)</strong> represent the crown jewel of early Buddhist practice, uniting all practical instructions of the historical Buddha into a coherent, experiential science of mental liberation.</p>

<h3 class="reader-subheading">I. The 4 Foundations of Mindfulness (Cattāro Satipaṭṭhānā)</h3>
<p>Mindful contemplation of reality through four direct windows: body (kāya), feelings (vedanā), mind (citta), and mental phenomena (dhammā), maintaining persistent vigilance to abandon covetousness and sorrow.</p>

<h3 class="reader-subheading">II. The 4 Right Efforts (Cattāro Sammappadhānā)</h3>
<ul>
  <li><strong>Restraint (Saṁvara-padhāna):</strong> Preventing unarisen unwholesome states from arising.</li>
  <li><strong>Abandonment (Pahāna-padhāna):</strong> Discarding arisen unwholesome states.</li>
  <li><strong>Cultivation (Bhāvanā-padhāna):</strong> Bringing unarisen wholesome states into existence.</li>
  <li><strong>Maintenance (Anurakkhana-padhāna):</strong> Stabilizing and perfecting arisen wholesome states.</li>
</ul>

<h3 class="reader-subheading">III. The 4 Bases of Spiritual Power (Cattāro Iddhipādā)</h3>
<p>The engine of contemplative mastery: Desire/Wholesome Aspiration (Chanda), Energy (Viriya), Mental Determination (Citta), and Investigation/Wisdom (Vīmaṁsā).</p>

<h3 class="reader-subheading">IV. The 5 Spiritual Faculties & 5 Powers (Indriya & Bala)</h3>
<p>Harmonizing Faith/Confidence (Saddhā) with Wisdom (Paññā), and Energy (Viriya) with Concentration (Samādhi), all supervised by ever-present Mindfulness (Sati).</p>

<h3 class="reader-subheading">V. The 7 Factors of Awakening (Satta Bojjhaṅgā)</h3>
<p>Mindfulness (Sati), Investigation of Dhamma (Dhamma-vicaya), Energy (Viriya), Joy (Pīti), Tranquility (Passaddhi), Concentration (Samādhi), and Equanimity (Upekkhā).</p>

<h3 class="reader-subheading">VI. The Noble Eightfold Path (Ariya Aṭṭhaṅgika Magga)</h3>
<p>The Middle Way that leads directly to the cessation of Dukkha: Right View, Right Intention, Right Speech, Right Action, Right Livelihood, Right Effort, Right Mindfulness, and Right Concentration.</p>
</div>"""
    },
    "phap-tu-cua-phat-lam-chu-sinh-gia-benh-chet": {
        "title_en": "The Buddha’s Method for Mastering Birth, Old Age, Sickness and Death",
        "pali_title_en": "Ānāpānasati & Kāyagatāsati Practice Manual",
        "category_name_en": "Theravāda Practice Manuals",
        "translator_en": "Ven. Thích Thông Lạc — English Monastic Edition",
        "reading_time_en": "42 min read",
        "summary_en": "A groundbreaking practical manual detailing how to overcome physical and emotional pain, illness, and the fear of death through the direct practice of verbal auto-suggestion (Tác Ý / Yoniso Manasikāra), Mindfulness of Breathing, and tranquil bodily composure.",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead">The ultimate promise of the Buddha's Dhamma is not mere philosophical debate, but the tangible mastery over suffering: <strong>conquering birth, aging, illness, and death in this very life.</strong></p>

<h3 class="reader-subheading">1. The Power of Wise Suggestion (Tác Ý / Yoniso Manasikāra)</h3>
<p>In early Buddhism, the mind leads all phenomena. When pain or disease strikes the body, the untrained mind panics, multiplying physical pain with psychological agony. By applying intentional directive mindfulness: <em>‘Breathing in, I calm bodily fabrication; breathing out, I calm bodily fabrication. Pain, depart from this body; mind, remain calm, serene, and fearless!’</em>, the practitioner activates profound psychological resilience.</p>

<h3 class="reader-subheading">2. Experiencing Neither-Pain-Nor-Pleasure</h3>
<p>By observing sensations without self-identification (Anattā), one realizes that pain is merely a transient sensation occurring in physical matter, not ‘me’ or ‘mine’. When the mind stops resisting or grasping, acute suffering dissolves into peaceful stillness.</p>
</div>"""
    },
    "thien-can-ban": {
        "title_en": "Foundational Buddhist Meditation — The Method of Relinquishment",
        "pali_title_en": "Chơn Như Meditation Hermitage Edition",
        "category_name_en": "Theravāda Practice Manuals",
        "translator_en": "Chơn Như Monastic Assembly",
        "reading_time_en": "35 min read",
        "summary_en": "A clear, accessible introduction to early Buddhist meditation that rejects mystical trance and artificial suppression, teaching instead the natural calming of the mind through moral restraint, mindful awareness, and the conscious letting go of defilements.",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead">True Buddhist meditation is not about sitting in trance for hours unaware of reality; it is the art of <strong>letting go of greed, anger, and delusion</strong> in every waking moment.</p>
<h3 class="reader-subheading">Core Steps of Practice:</h3>
<ol>
  <li><strong>Purification of Conduct (Sīla):</strong> Without virtuous moral foundation, meditation becomes unstable.</li>
  <li><strong>Sense Door Restraint:</strong> Guarding what enters through eye, ear, nose, tongue, body, and intellect.</li>
  <li><strong>Mindful Relinquishment (Xả Tâm):</strong> Whenever a grievance or greed arises, immediately recognize it as unwholesome and let it fade.</li>
  <li><strong>Unwavering Serenity:</strong> Cultivating a state of mind that is Immovable, Tranquil, Peaceful, and Free (Tâm Bất Động, Thanh Thản, An Lạc, Vô Sự).</li>
</ol>
</div>"""
    },
    "muoi-hai-cua-vao-dao": {
        "title_en": "The Twelve Gateways to the Path of Awakening",
        "pali_title_en": "Sequential Training in Early Buddhism",
        "category_name_en": "Theravāda Practice Manuals",
        "translator_en": "Chơn Như Monastic Assembly",
        "reading_time_en": "40 min read",
        "summary_en": "A step-by-step roadmap outlining the twelve sequential gates of training: from ethical conduct and sense restraint to overcoming the five hindrances, entering meditative stillness, and cultivating the liberating wisdom of Nibbāna.",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead">The Buddha’s teaching is a graduated training, a graduated practice, a graduated progression (anupubbasikkhā, anupubbakiriyā, anupubbapaṭipadā).</p>
<h3 class="reader-subheading">The Twelve Essential Gateways:</h3>
<ol>
  <li>The Gate of Moral Virtue and the Precepts (Sīla)</li>
  <li>The Gate of Guarding the Sense Doors (Indriya-saṁvara)</li>
  <li>The Gate of Moderation in Food (Bhojane mattaññutā)</li>
  <li>The Gate of Dedication to Wakefulness (Jāgariyānuyoga)</li>
  <li>The Gate of Mindfulness and Clear Comprehension (Satisampajañña)</li>
  <li>The Gate of Seeking Solitude and Seclusion (Viveka)</li>
  <li>The Gate of Subduing the Five Hindrances (Nīvaraṇa-pahāna)</li>
  <li>The Gate of the First Jhāna: Freedom from Sensuality</li>
  <li>The Gate of the Second Jhāna: Inner Stillness and Unification</li>
  <li>The Gate of the Third Jhāna: Mindful Equanimity</li>
  <li>The Gate of the Fourth Jhāna: Complete Purity of Equanimity and Mindfulness</li>
  <li>The Gate of Supreme Wisdom and Liberation (Vimutti-ñāṇadassana)</li>
</ol>
</div>"""
    },
    "bk-trungbo": {
        "title_en": "MAJJHIMA NIKĀYA — The Middle Length Discourses (50 Core Suttas)",
        "pali_title_en": "Majjhima Nikāya Mūlapannāsa",
        "category_name_en": "The Five Nikāya Collections",
        "translator_en": "Venerable Thích Minh Châu / Bhikkhu Bodhi",
        "reading_time_en": "25 min read",
        "summary_en": "A comprehensive introductory overview to the Middle Length Discourses of the Buddha (Majjhima Nikāya), containing 50 foundational suttas on psychological wisdom, monastic discipline, and direct paths to liberation.",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead">The <strong>Majjhima Nikāya (Middle Length Discourses)</strong> is widely considered the most accessible and profound collection of the Buddha's teachings on practical psychological insight and meditative practice.</p>
<h3 class="reader-subheading">Core Highlights of the Collection:</h3>
<ul>
  <li><strong>Satipaṭṭhāna Sutta (MN 10):</strong> The direct path to Awakening through 4 Foundations of Mindfulness.</li>
  <li><strong>Mūlapariyāya Sutta (MN 1):</strong> The root causes of all cognitive delusion and attachment.</li>
  <li><strong>Sabbāsava Sutta (MN 2):</strong> Seven practical methods to eliminate all mental defilements.</li>
  <li><strong>Ānāpānasati Sutta (MN 118):</strong> The 16 steps of breath awareness fulfilling the 4 Satipaṭṭhāna and 7 Bojjhaṅga.</li>
  <li><strong>Cūḷamālukya Sutta (MN 63):</strong> The famous parable of the poisoned arrow, turning away from speculative metaphysics toward immediate release from suffering.</li>
</ul>
</div>"""
    },
    "bk-truongbo": {
        "title_en": "DĪGHA NIKĀYA — The Long Discourses of the Buddha (34 Suttas)",
        "pali_title_en": "Dīgha Nikāya",
        "category_name_en": "The Five Nikāya Collections",
        "translator_en": "Venerable Thích Minh Châu / Maurice Walshe",
        "reading_time_en": "22 min read",
        "summary_en": "An overview of the 34 extensive monumental discourses of the Dīgha Nikāya, including the Brahmajāla Sutta on the 62 views, the Sāmaññaphala Sutta on the fruits of monkhood, and the Mahāparinibbāna Sutta recording the Buddha’s final days and passing.",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead">The <strong>Dīgha Nikāya (Long Discourses)</strong> consists of 34 profound masterworks revealing the historical, sociological, and philosophical grandeur of early Buddhism.</p>
<h3 class="reader-subheading">Key Suttas in the Dīgha Nikāya:</h3>
<ul>
  <li><strong>Brahmajāla Sutta (DN 1):</strong> The Supreme Net analyzing all 62 speculative worldviews.</li>
  <li><strong>Sāmaññaphala Sutta (DN 2):</strong> The tangible visible fruits of contemplative life.</li>
  <li><strong>Mahāparinibbāna Sutta (DN 16):</strong> The moving historical chronicle of the Buddha’s final journey and last instructions: <em>‘Be islands unto yourselves, refuges unto yourselves, with the Dhamma as your island and refuge.’</em></li>
  <li><strong>Sigālovāda Sutta (DN 31):</strong> The layman’s code of ethics establishing harmony in the six directions of human relationship.</li>
</ul>
</div>"""
    },
    "bk-tuongung": {
        "title_en": "SAṂYUTTA NIKĀYA — The Connected Discourses of the Buddha",
        "pali_title_en": "Saṃyutta Nikāya",
        "category_name_en": "The Five Nikāya Collections",
        "translator_en": "Venerable Thích Minh Châu / Bhikkhu Bodhi",
        "reading_time_en": "20 min read",
        "summary_en": "An essential guide to the Connected Discourses, organizing teachings thematically around the Five Aggregates (Khandha), Dependent Origination (Paṭiccasamuppāda), and the Four Noble Truths.",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead">The <strong>Saṃyutta Nikāya</strong> groups thousands of suttas by theme, housing the most critical doctrinal definitions in the entire Buddhist canon.</p>
<h3 class="reader-subheading">Major Thematic Sections (Saṃyuttas):</h3>
<ul>
  <li><strong>Khandhasaṃyutta:</strong> Analytical deconstruction of the Five Aggregates (Form, Feeling, Perception, Volitional Formations, Consciousness) as impermanent, unsatisfactory, and non-self.</li>
  <li><strong>Nidānasaṃyutta:</strong> The twelve links of Dependent Origination (Paṭiccasamuppāda).</li>
  <li><strong>Saccasaṃyutta:</strong> The Four Noble Truths and their twelve aspects.</li>
  <li><strong>Dhammacakkappavattana Sutta (SN 56.11):</strong> The First Sermon in the Deer Park setting the Wheel of Dhamma in motion.</li>
</ul>
</div>"""
    },
    "bk-tangchi": {
        "title_en": "AṄGUTTARA NIKĀYA — The Numerical Discourses of the Buddha",
        "pali_title_en": "Aṅguttara Nikāya",
        "category_name_en": "The Five Nikāya Collections",
        "translator_en": "Venerable Thích Minh Châu / Bhikkhu Bodhi",
        "reading_time_en": "20 min read",
        "summary_en": "A vibrant pedagogical treasure trove organizing suttas numerically from sets of 1 to sets of 11, focusing on practical lay ethics, leadership, friendship, family harmony, and monastic perfection.",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead">The <strong>Aṅguttara Nikāya</strong> is famous for its practical, real-world applicability for lay practitioners and rulers, categorized from the Book of Ones to the Book of Elevens.</p>
<h3 class="reader-subheading">Highlights:</h3>
<ul>
  <li><strong>The Kālāma Sutta (AN 3.65):</strong> The charter of free inquiry advising against blind faith based on tradition, rumors, scripture, or charisma, urging testing through direct personal experience.</li>
  <li><strong>The Four Noble Tasks:</strong> Protecting righteousness, building righteous wealth, sharing with society, and practicing mental tranquility.</li>
</ul>
</div>"""
    },
    "bk-tieubo": {
        "title_en": "KHUDDAKA NIKĀYA — The Minor Collection & Dhammapada",
        "pali_title_en": "Khuddaka Nikāya",
        "category_name_en": "The Five Nikāya Collections",
        "translator_en": "Venerable Thích Minh Châu / Acharya Buddharakkhita",
        "reading_time_en": "18 min read",
        "summary_en": "An overview of the beloved literary and poetic collection of the Pāli Canon, including the timeless 423 verses of the Dhammapada, the inspiring Udāna, the Sutta Nipāta, and the Theragāthā / Therīgāthā (Verses of the Elders).",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead">The <strong>Khuddaka Nikāya</strong> contains the oldest and most poetically evocative verses of early Buddhism.</p>
<h3 class="reader-subheading">Core Texts:</h3>
<ul>
  <li><strong>Dhammapada:</strong> 423 immortal verses of wisdom: <em>‘Hatred does not cease by hatred, but only by love; this is the eternal rule.’</em></li>
  <li><strong>Sutta Nipāta:</strong> Ancient rhythmic verses on ascetic simplicity, including the Metta Sutta (Loving-Kindness) and Mangala Sutta (Highest Blessings).</li>
  <li><strong>Udāna & Itivuttaka:</strong> Spontaneous exclamations of joy upon liberation by the Buddha and enlightened disciples.</li>
</ul>
</div>"""
    },
    "bk-duongvexuphat": {
        "title_en": "THE PATH TO THE BUDDHA’S LAND (10 Volumes)",
        "pali_title_en": "Restoration of Pristine Buddhism",
        "category_name_en": "Chơn Như Master Collection",
        "translator_en": "Chơn Như Monastic Assembly",
        "reading_time_en": "15 min read",
        "summary_en": "A landmark 10-volume comparative exposition by Elder Thích Thông Lạc restoring the original spirit of early Theravāda Buddhism: stripping away esoteric superstition and emphasizing self-reliance, moral precepts, and direct experiential cessation of suffering.",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead"><strong>The Path to the Buddha's Land</strong> is an exhaustive 10-volume opus by Elder Thích Thông Lạc dedicated to rectifying centuries of metaphysical syncretism and returning to the pristine simplicity of early Buddhism.</p>
<h3 class="reader-subheading">Pillars of the Work:</h3>
<ul>
  <li>Distinguishing original Dhamma from later ritualistic additions (praying for luck, chanting for dead souls, burning paper offerings).</li>
  <li>Restoring the Buddha’s call: <em>‘Be your own lamp, take refuge in no external god or entity.’</em></li>
  <li>Realizing Nibbāna not as a far-off mystical paradise, but as a state of mind free from anger, craving, and agitation here and now.</li>
</ul>
</div>"""
    },
    "bk-37pham": {
        "title_en": "THE THIRTY-SEVEN AIDS TO AWAKENING — Practice Manual",
        "pali_title_en": "Direct Practical Syllabus",
        "category_name_en": "Chơn Như Master Collection",
        "translator_en": "Chơn Như Monastic Assembly",
        "reading_time_en": "16 min read",
        "summary_en": "A direct, practitioner-oriented handbook guiding seekers through the practical mastery of the 37 Bodhipakkhiyā Dhammā, translating ancient formulations into actionable daily contemplative routines.",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead">A step-by-step practical guide to realizing the 37 Factors of Awakening in everyday life.</p>
<h3 class="reader-subheading">Key Practical Instructions:</h3>
<ul>
  <li>How to anchor the mind in the body during walking and sitting meditation.</li>
  <li>How to employ auto-suggestion (Tác Ý) to quickly dissipate anger, lust, and drowsiness.</li>
  <li>Cultivating the Seven Awakening Factors to bring about mental equilibrium and clarity.</li>
</ul>
</div>"""
    },
    "bk-lamchusinhgia": {
        "title_en": "PRACTICE OF OVERCOMING BIRTH, AGING, ILLNESS & DEATH",
        "pali_title_en": "Mindful Directive Auto-Suggestion",
        "category_name_en": "Chơn Như Master Collection",
        "translator_en": "Chơn Như Monastic Assembly",
        "reading_time_en": "15 min read",
        "summary_en": "A practical training guide teaching mindfulness of the body and verbal auto-suggestion to relieve physical pain, calm severe illness, and face death with supreme tranquility and confidence.",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead">How to cultivate an unshakeable mind in the face of physical sickness, aging, and dying.</p>
<h3 class="reader-subheading">Core Principles:</h3>
<p>By learning to separate physical sensation from mental panic, the practitioner experiences pure equanimity. Directives such as <em>‘Tâm bất động, thanh thản, an lạc, vô sự’</em> (Mind immovable, serene, joyful, and untroubled) train the subconscious to remain anchored in peace regardless of bodily turmoil.</p>
</div>"""
    },
    "bk-daoduclamnguoi": {
        "title_en": "HUMAN ETHICS & REVERENCE FOR LIFE — The Five Virtuous Precepts",
        "pali_title_en": "Humanitarian Ethics in Early Buddhism",
        "category_name_en": "Chơn Như Master Collection",
        "translator_en": "Chơn Như Monastic Assembly",
        "reading_time_en": "16 min read",
        "summary_en": "An essential treatise demonstrating that the Five Buddhist Precepts are not restrictive dogma, but the universal humanitarian laws of love, harmlessness, and mutual protection that bring enduring joy to individuals, families, and society.",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead">The Five Precepts are the moral bedrock of human happiness and world peace.</p>
<h3 class="reader-subheading">The Five Universal Virtues:</h3>
<ol>
  <li><strong>Reverence for Life:</strong> Abstaining from killing, cultivating universal benevolence toward all living creatures.</li>
  <li><strong>Respect for Property:</strong> Abstaining from theft and greed, fostering honesty and fair livelihood.</li>
  <li><strong>Chastity and Marital Faithfulness:</strong> Protecting family loyalty and genuine mutual devotion.</li>
  <li><strong>Truthfulness and Trust:</strong> Speaking words of truth, gentleness, and reconciliation.</li>
  <li><strong>Mental Sobriety:</strong> Abstaining from alcohol and intoxicants, preserving a lucid and compassionate mind.</li>
</ol>
</div>"""
    },
    "bk-nhungloigoc": {
        "title_en": "THE ORIGINAL WORDS OF THE BUDDHA (4 Volumes)",
        "pali_title_en": "Pali Canon Comparative Anthology",
        "category_name_en": "Chơn Như Master Collection",
        "translator_en": "Chơn Như Monastic Assembly",
        "reading_time_en": "15 min read",
        "summary_en": "A rigorous 4-volume comparative study directly juxtaposing the original words of the Pāli Nikāyas against later philosophical innovations, returning practitioners to the authentic path of ethical self-restraint and liberation.",
        "content_html_en": """<div class="sutta-english-content">
<p class="sutta-lead">A return to the source: distinguishing pristine early Buddhist teachings from later devotional and esoteric accretions.</p>
<h3 class="reader-subheading">Key Messages:</h3>
<ul>
  <li>The Buddha never taught salvation through rites, rituals, or external deities.</li>
  <li>Deliverance is attained through one's own ethical discipline, self-restraint, and mental stillness.</li>
  <li>The four jhānas are achievable in this very life through moral purity and the relinquishment of unwholesome states.</li>
</ul>
</div>"""
    }
}

# Translate pages_data if available
PAGE_TRANSLATIONS = {
    "Trang I • Tủ Sách LIDO": "Page I • LIDO Library",
    "Trang 2 • Tủ Sách LIDO": "Page 2 • LIDO Library",
    "Trang 3 • Tủ Sách LIDO": "Page 3 • LIDO Library",
    "Trang 4 • Hết Trích Đoạn": "Page 4 • End of Selection",
    "Bản 50 Bài Kinh Căn Bản (Mūlapannāsa)": "50 Core Suttas Collection (Mūlapannāsa)",
    "HỒI HƯỚNG CÔNG ĐỨC CHÁNH PHÁP": "DEDICATION OF MERIT",
    "Công Đức Vô Lượng Phụng Sự Đạo Tràng": "Immeasurable Merit Serving the Dhamma Community"
}

updated_count = 0
for item in catalog:
    s_id = item.get("id")
    if s_id in EN_DATA:
        en = EN_DATA[s_id]
        item["title_en"] = en["title_en"]
        item["pali_title_en"] = en["pali_title_en"]
        item["category_name_en"] = en["category_name_en"]
        item["translator_en"] = en["translator_en"]
        item["reading_time_en"] = en["reading_time_en"]
        item["summary_en"] = en["summary_en"]
        item["content_html_en"] = en["content_html_en"]
        
        # If item has pages_data, create pages_data_en
        if "pages_data" in item and isinstance(item["pages_data"], list):
            pages_en = []
            for p in item["pages_data"]:
                p_copy = dict(p)
                p_copy["footer"] = PAGE_TRANSLATIONS.get(p.get("footer", ""), p.get("footer", ""))
                p_copy["title"] = en["title_en"] if p.get("pageNumber") == 1 else p.get("title", "")
                pages_en.append(p_copy)
            item["pages_data_en"] = pages_en
        
        updated_count += 1

print(f"Updated {updated_count} / {len(catalog)} suttas with comprehensive English translations.")

# Save JSON
with open(CATALOG_PATH, "w", encoding="utf-8") as f:
    json.dump(catalog, f, ensure_ascii=False, indent=2)

# Save JS
with open(DATA_JS_PATH, "w", encoding="utf-8") as f:
    f.write("window.KINH_SACH_CATALOG = " + json.dumps(catalog, ensure_ascii=False, indent=2) + ";\n")

print("Successfully written to catalog.json and data.js!")
