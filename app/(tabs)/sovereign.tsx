import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';

/**
 * Sovereign I — Creative Studio visual prototype
 * UI-only prototype. Sample content only; no Supabase or agent calls.
 * Keep separate from the production SovereignIConsole until the design is approved.
 */

const C = {
  ink: '#0B0B0A', panel: '#141412', panel2: '#1C1B18', line: '#34312A',
  gold: '#C9A84E', ivory: '#F3EFE6', muted: '#A6A197', plum: '#806080',
  sage: '#668276', clay: '#B96F55', lilac: '#C9B5D4', pale: '#E9E1D3',
};
const stages = [
  { id: 'DREAM', no: '01', hint: 'Imagine without limits', accent: C.lilac },
  { id: 'DISCOVER', no: '02', hint: 'Listen for what is true', accent: C.gold },
  { id: 'BUILD', no: '03', hint: 'Give the idea a form', accent: C.clay },
  { id: 'GROW', no: '04', hint: 'Nurture what is alive', accent: C.sage },
  { id: 'SCALE', no: '05', hint: 'Let it reach further', accent: '#B5A05B' },
  { id: 'RENEW', no: '06', hint: 'Make space for the next', accent: '#8B9DA8' },
];

function Eyebrow({ children, color = C.muted }: { children: React.ReactNode; color?: string }) {
  return <Text style={[s.eyebrow, { color }]}>{children}</Text>;
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={s.sectionTitle}>{children}</Text>;
}
function Pill({ children, active, onPress, accent = C.gold }: { children: React.ReactNode; active?: boolean; onPress?: () => void; accent?: string }) {
  return <Pressable onPress={onPress} style={[s.pill, active && { borderColor: accent, backgroundColor: `${accent}1C` }]}><Text style={[s.pillText, active && { color: C.ivory }]}>{children}</Text></Pressable>;
}

export default function SovereignStudioPrototype() {
  const { width } = useWindowDimensions();
  const compact = width < 900;
  const [stageIndex, setStageIndex] = useState(0);
  const [desire, setDesire] = useState('A life with space to create, meaningful work, deep connection and enough freedom to follow what feels alive.');
  const stage = stages[stageIndex];

  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" backgroundColor={C.ink} />
      <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
        <View style={s.topbar}>
          <View style={s.brandLockup}><View style={s.brandMark}><Text style={s.brandMarkText}>S</Text></View><View><Text style={s.brandName}>SOVEREIGN I</Text><Text style={s.brandSub}>CONSCIOUS CREATING</Text></View></View>
          <View style={s.topbarRight}><Text style={s.topbarNote}>YOUR CREATIVE STUDIO</Text><View style={s.avatar}><Text style={s.avatarText}>I</Text></View></View>
        </View>

        <View style={s.intro}>
          <View style={{ flex: 1 }}><Eyebrow color={C.gold}>A SPACE TO BECOME</Eyebrow><Text style={s.heroTitle}>What wants{ '\n' }to come into <Text style={{ color: C.gold, fontStyle: 'italic' }}>being?</Text></Text><Text style={s.heroSub}>Begin with what matters. Follow what feels alive. Let the creation reveal itself.</Text></View>
          <View style={s.introSide}><View style={s.orbit}><View style={s.orbitInner}><Text style={s.orbitGlyph}>✳</Text></View></View><Text style={s.introSideText}>DREAM · DISCOVER · CREATE</Text></View>
        </View>

        <View style={[s.studioGrid, compact && s.studioGridCompact]}>
          {/* PERSONAL ANCHOR */}
          <View style={[s.leftRail, compact && s.railCompact]}>
            <View style={s.railHeading}><Eyebrow>YOUR INNER COMPASS</Eyebrow><Text style={s.railGlyph}>↗</Text></View>
            <SectionTitle>What matters to me</SectionTitle>
            <Text style={s.bodyCopy}>A reminder of the life you're choosing to create.</Text>
            <View style={s.moodboard}>
              <View style={s.moodImage}><View style={s.sun}/><View style={s.horizon}/><View style={s.mountainOne}/><View style={s.mountainTwo}/><Text style={s.imageLabel}>ROOM TO BREATHE</Text></View>
              <View style={s.noteCard}><Eyebrow color={C.plum}>MY NORTH STAR</Eyebrow><Text style={s.noteQuote}>“A life that feels like mine.”</Text><Text style={s.noteCaption}>Presence · Freedom · Connection</Text></View>
              <View style={s.valueStrip}><View style={[s.valueDot,{backgroundColor:C.gold}]}/><Text style={s.valueText}>Create with intention</Text></View>
              <View style={s.valueStrip}><View style={[s.valueDot,{backgroundColor:C.plum}]}/><Text style={s.valueText}>Choose what feels true</Text></View>
              <View style={s.valueStrip}><View style={[s.valueDot,{backgroundColor:C.sage}]}/><Text style={s.valueText}>Leave room for wonder</Text></View>
            </View>
            <Pressable style={s.textLink}><Text style={s.textLinkText}>＋  Add to my compass</Text></Pressable>
          </View>

          {/* CREATIVE CANVAS */}
          <View style={s.canvas}>
            <View style={s.canvasTop}><View><Eyebrow color={stage.accent}>YOUR CREATION · {stage.no}</Eyebrow><Text style={s.canvasTitle}>{stage.id.charAt(0) + stage.id.slice(1).toLowerCase()}</Text><Text style={s.canvasHint}>{stage.hint}</Text></View><View style={[s.stageBadge,{borderColor:`${stage.accent}77`}]}><Text style={[s.stageBadgeText,{color:stage.accent}]}>{stage.no} / 06</Text></View></View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.stageRail}>
              {stages.map((item, i) => <Pressable key={item.id} onPress={() => setStageIndex(i)} style={[s.stageTab, stageIndex === i && { borderBottomColor: item.accent, borderBottomWidth: 2 }]}><Text style={[s.stageTabNo, stageIndex === i && { color: item.accent }]}>{item.no}</Text><Text style={[s.stageTabLabel, stageIndex === i && { color: C.ivory }]}>{item.id}</Text></Pressable>)}
            </ScrollView>
            <View style={[s.promptCard,{borderLeftColor:stage.accent}]}><Eyebrow color={stage.accent}>A QUESTION TO OPEN THE DOOR</Eyebrow><Text style={s.promptTitle}>{stageIndex === 0 ? 'If anything were possible, what would you love to experience?' : stageIndex === 1 ? 'What is the desire beneath the desire?' : stageIndex === 2 ? 'What is one form this could take in the world?' : stageIndex === 3 ? 'What needs your care and attention now?' : stageIndex === 4 ? 'Where could this creation reach next?' : 'What is complete, and what wants to begin again?'}</Text></View>
            <View style={s.writeHeader}><Text style={s.writeLabel}>YOUR SPACE TO EXPLORE</Text><Text style={s.writeMeta}>A living draft · edit freely</Text></View>
            <TextInput value={desire} onChangeText={setDesire} multiline textAlignVertical="top" placeholder="Let the words arrive…" placeholderTextColor="#77736A" style={s.writingSurface}/>
            <View style={s.canvasActions}><Text style={s.canvasFootnote}>No need to have it all figured out.</Text><Pressable style={[s.actionButton,{backgroundColor:stage.accent}]}><Text style={s.actionButtonText}>Continue exploring ↗</Text></Pressable></View>
            <View style={s.discoveryRow}><View style={s.discoveryIcon}><Text style={{color:C.gold,fontSize:20}}>✧</Text></View><View style={{flex:1}}><Eyebrow color={C.gold}>A LITTLE SPACE FOR DISCOVERY</Eyebrow><Text style={s.discoveryTitle}>What else might be possible?</Text><Text style={s.discoveryCopy}>Collect an image, a question, a small clue. Your next step doesn't have to be a plan.</Text></View><Text style={s.discoveryArrow}>↗</Text></View>
          </View>

          {/* OUTCOMES / ARTIFACTS */}
          <View style={[s.rightRail, compact && s.railCompact]}>
            <View style={s.railHeading}><Eyebrow>WHAT THIS CREATION TOUCHES</Eyebrow><Text style={s.railGlyph}>↗</Text></View>
            <SectionTitle>Ripples outward</SectionTitle>
            <Text style={s.bodyCopy}>A creation changes more than one thing.</Text>
            <View style={[s.rippleCard,{backgroundColor:'#25211B'}]}><View style={s.rippleTop}><Text style={[s.rippleRoman,{color:C.gold}]}>I</Text><Eyebrow color={C.gold}>EMBODIMENT</Eyebrow></View><Text style={s.rippleTitle}>The life I live</Text><Text style={s.rippleCopy}>Practices, choices and ways of being that make the intention real.</Text><View style={s.miniArtifact}><Text style={s.miniArtifactGlyph}>✧</Text><View style={{flex:1}}><Text style={s.miniArtifactTitle}>A daily alignment ritual</Text><Text style={s.miniArtifactSub}>PRACTICE · IN PROGRESS</Text></View><Text style={s.cardArrow}>↗</Text></View></View>
            <View style={[s.rippleCard,{backgroundColor:'#202320'}]}><View style={s.rippleTop}><Text style={[s.rippleRoman,{color:'#8FB09D'}]}>Ⅱ</Text><Eyebrow color="#8FB09D">PEOPLE</Eyebrow></View><Text style={s.rippleTitle}>The connections I nurture</Text><Text style={s.rippleCopy}>Relationships shaped by presence, reciprocity and care.</Text><View style={s.miniArtifact}><Text style={s.miniArtifactGlyph}>↗</Text><View style={{flex:1}}><Text style={s.miniArtifactTitle}>A conversation to have</Text><Text style={s.miniArtifactSub}>REFLECTION · EMERGING</Text></View><Text style={s.cardArrow}>↗</Text></View></View>
            <View style={[s.rippleCard,{backgroundColor:'#252027'}]}><View style={s.rippleTop}><Text style={[s.rippleRoman,{color:C.lilac}]}>Ⅲ</Text><Eyebrow color={C.lilac}>PLANET</Eyebrow></View><Text style={s.rippleTitle}>What I contribute</Text><Text style={s.rippleCopy}>The difference this creation can make beyond me.</Text><View style={s.miniArtifact}><Text style={s.miniArtifactGlyph}>❋</Text><View style={{flex:1}}><Text style={s.miniArtifactTitle}>A contribution to explore</Text><Text style={s.miniArtifactSub}>POSSIBILITY · OPEN</Text></View><Text style={s.cardArrow}>↗</Text></View></View>
            <Pressable style={s.textLink}><Text style={s.textLinkText}>＋  Create an artefact</Text></Pressable>
          </View>
        </View>
        <View style={s.footer}><Text style={s.footerMark}>✳</Text><Text style={s.footerText}>A creation is a conversation between what matters to you and what becomes possible.</Text><Text style={s.footerTag}>SOVEREIGN I · CONSCIOUS CREATING</Text></View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen:{flex:1,backgroundColor:C.ink}, page:{paddingHorizontal:30,paddingBottom:48,maxWidth:1800,width:'100%',alignSelf:'center'},
  topbar:{height:76,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:C.line}, brandLockup:{flexDirection:'row',alignItems:'center',gap:11},brandMark:{width:34,height:34,borderWidth:1,borderColor:C.gold,borderRadius:17,alignItems:'center',justifyContent:'center'},brandMarkText:{color:C.gold,fontSize:19,fontFamily:'serif'},brandName:{color:C.ivory,fontSize:11,letterSpacing:2.5,fontWeight:'600'},brandSub:{color:C.muted,fontSize:8,letterSpacing:2,marginTop:4},topbarRight:{flexDirection:'row',alignItems:'center',gap:18},topbarNote:{color:C.muted,fontSize:8,letterSpacing:1.8},avatar:{width:30,height:30,borderRadius:15,backgroundColor:C.panel2,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center'},avatarText:{color:C.gold,fontSize:12},
  intro:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:36,paddingBottom:34,gap:24},eyebrow:{fontSize:9,letterSpacing:1.8,fontWeight:'600'},heroTitle:{fontSize:clampFont(48,72),lineHeight:clampFont(54,78),color:C.ivory,marginTop:14,fontWeight:'300',letterSpacing:-2},heroSub:{color:C.muted,fontSize:13,lineHeight:21,maxWidth:470,marginTop:14},introSide:{alignItems:'center',justifyContent:'center',paddingHorizontal:24},orbit:{width:105,height:105,borderWidth:1,borderColor:'#65562E',borderRadius:60,alignItems:'center',justifyContent:'center'},orbitInner:{width:75,height:75,borderWidth:1,borderColor:'#383127',borderRadius:45,alignItems:'center',justifyContent:'center'},orbitGlyph:{color:C.gold,fontSize:36},introSideText:{color:'#82785E',fontSize:7,letterSpacing:1.5,marginTop:12},
  studioGrid:{flexDirection:'row',alignItems:'flex-start',gap:22},studioGridCompact:{flexDirection:'column'},leftRail:{width:'22%',minWidth:210,paddingTop:10},railCompact:{width:'100%',minWidth:0},canvas:{flex:1,minWidth:0,backgroundColor:'#111110',borderWidth:1,borderColor:'#302D26',borderRadius:15,padding:24},rightRail:{width:'24%',minWidth:230,paddingTop:10},railHeading:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:15},railGlyph:{color:C.gold,fontSize:16},sectionTitle:{color:C.ivory,fontSize:21,lineHeight:28,fontWeight:'400',letterSpacing:-.4},bodyCopy:{color:C.muted,fontSize:11,lineHeight:17,marginTop:7,marginBottom:18},
  moodboard:{minHeight:330,backgroundColor:'#171613',borderRadius:12,padding:10,borderWidth:1,borderColor:'#2E2A23'},moodImage:{height:142,backgroundColor:'#31312D',borderRadius:7,overflow:'hidden',position:'relative',justifyContent:'flex-end',padding:12},sun:{position:'absolute',width:55,height:55,borderRadius:30,backgroundColor:'#D6B887',top:20,right:25,opacity:.9},horizon:{position:'absolute',left:0,right:0,bottom:0,height:58,backgroundColor:'#777B70'},mountainOne:{position:'absolute',bottom:0,left:10,width:0,height:0,borderLeftWidth:0,borderRightWidth:72,borderBottomWidth:67,borderLeftColor:'transparent',borderRightColor:'transparent',borderBottomColor:'#414943'},mountainTwo:{position:'absolute',bottom:0,right:20,width:0,height:0,borderLeftWidth:55,borderRightWidth:0,borderBottomWidth:48,borderLeftColor:'transparent',borderRightColor:'transparent',borderBottomColor:'#596054'},imageLabel:{color:'#F3EFE6',fontSize:8,letterSpacing:1.8,zIndex:2},noteCard:{backgroundColor:C.pale,padding:14,marginTop:-8,marginLeft:20,marginRight:8,zIndex:2,borderRadius:4,transform:[{rotate:'-1deg'}]},noteQuote:{fontFamily:'serif',fontSize:19,color:'#29251F',marginTop:8,lineHeight:24},noteCaption:{color:'#71695D',fontSize:8,marginTop:9,letterSpacing:.4},valueStrip:{flexDirection:'row',alignItems:'center',gap:8,marginTop:11,paddingHorizontal:4},valueDot:{width:6,height:6,borderRadius:3},valueText:{color:'#C9C3B8',fontSize:10},textLink:{paddingVertical:15,alignSelf:'flex-start'},textLinkText:{color:C.gold,fontSize:10,letterSpacing:.4},
  canvasTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',gap:10},canvasTitle:{color:C.ivory,fontSize:36,lineHeight:42,fontWeight:'300',letterSpacing:-1,marginTop:8},canvasHint:{color:C.muted,fontSize:12,marginTop:5},stageBadge:{borderWidth:1,borderRadius:20,paddingHorizontal:11,paddingVertical:7},stageBadgeText:{fontSize:8,letterSpacing:1.2},stageRail:{flexDirection:'row',borderBottomWidth:1,borderBottomColor:C.line,marginTop:23,marginBottom:22,gap:4},stageTab:{paddingHorizontal:12,paddingVertical:12,borderBottomWidth:2,borderBottomColor:'transparent',minWidth:68,alignItems:'center'},stageTabNo:{color:'#706C62',fontSize:8,marginBottom:6},stageTabLabel:{color:'#8E897F',fontSize:9,letterSpacing:1.1},promptCard:{borderLeftWidth:2,backgroundColor:'#1B1A17',padding:17,borderTopRightRadius:8,borderBottomRightRadius:8,marginBottom:22},promptTitle:{color:C.ivory,fontSize:18,lineHeight:25,fontFamily:'serif',marginTop:9,maxWidth:700},writeHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10},writeLabel:{color:'#B4AEA2',fontSize:8,letterSpacing:1.5},writeMeta:{color:'#77736A',fontSize:9},writingSurface:{minHeight:180,backgroundColor:'#E9E5DC',borderRadius:8,padding:20,color:'#302E29',fontSize:14,lineHeight:23,fontWeight:'300'},canvasActions:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,marginTop:15,flexWrap:'wrap'},canvasFootnote:{color:'#8D877B',fontSize:10,fontStyle:'italic'},actionButton:{borderRadius:22,paddingHorizontal:16,paddingVertical:11},actionButtonText:{color:'#17140E',fontSize:10,fontWeight:'600'},discoveryRow:{flexDirection:'row',alignItems:'flex-start',gap:12,borderTopWidth:1,borderTopColor:C.line,marginTop:24,paddingTop:19},discoveryIcon:{width:36,height:36,borderRadius:18,backgroundColor:'#29251C',alignItems:'center',justifyContent:'center'},discoveryTitle:{color:C.ivory,fontSize:14,marginTop:6},discoveryCopy:{color:C.muted,fontSize:10,lineHeight:16,marginTop:5,maxWidth:500},discoveryArrow:{color:C.gold,fontSize:17,paddingTop:4},
  rippleCard:{padding:14,borderRadius:10,marginTop:10,borderWidth:1,borderColor:'#34312B'},rippleTop:{flexDirection:'row',alignItems:'center',gap:9},rippleRoman:{fontSize:20,fontFamily:'serif'},rippleTitle:{color:C.ivory,fontSize:15,marginTop:12,fontFamily:'serif'},rippleCopy:{color:'#AAA59B',fontSize:10,lineHeight:16,marginTop:6},miniArtifact:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#11111055',padding:9,borderRadius:6,marginTop:13},miniArtifactGlyph:{color:C.gold,fontSize:15},miniArtifactTitle:{color:'#E5DFD3',fontSize:9,lineHeight:13},miniArtifactSub:{color:'#8C877C',fontSize:7,letterSpacing:.8,marginTop:4},cardArrow:{color:'#AFA58C',fontSize:12},footer:{borderTopWidth:1,borderTopColor:C.line,marginTop:34,paddingTop:20,flexDirection:'row',alignItems:'center',gap:12,flexWrap:'wrap'},footerMark:{color:C.gold,fontSize:18},footerText:{color:'#9E988C',fontSize:10,flex:1},footerTag:{color:'#6F6A60',fontSize:7,letterSpacing:1.4},pill:{paddingHorizontal:10,paddingVertical:7,borderRadius:20,borderWidth:1,borderColor:C.line},pillText:{color:C.muted,fontSize:9},
});

function clampFont(min: number, max: number) {
  // React Native font sizes are static here; a midpoint keeps the prototype readable across widths.
  return (min + max) / 2;
}
